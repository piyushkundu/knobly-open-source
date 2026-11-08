import { NextRequest, NextResponse } from 'next/server';
import { AI_LIMITS, aiChoice, aiErrorResponse, aiText, createAIClient, readAIRequest } from '@/lib/ai-request';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const SARVAM_API_KEY = process.env.SARVAM_API_KEY || '';

// ── English: Groq outputs well-structured JSON ──
const ENGLISH_SYSTEM_PROMPT = `You are KnoblyAI — an expert teacher and content creator for Knobly Web learning platform.

YOUR TASK: Generate a comprehensive, well-structured explanation of the given topic.

OUTPUT FORMAT — You MUST respond ONLY with valid JSON, no markdown wrapping, no code fences. The JSON structure:

{
  "title": "Topic Title",
  "summary": "A 1-2 line summary of the topic",
  "sections": [
    {
      "heading": "Section Heading",
      "content": "Detailed explanation in HTML format. Use <p>, <strong>, <em>, <ul>, <li>, <ol> tags. Keep content educational and clear.",
      "code": "optional code example if relevant",
      "codeLanguage": "python or html or javascript or css",
      "example": "optional real-world example or analogy"
    }
  ],
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "relatedTopics": ["Related Topic 1", "Related Topic 2", "Related Topic 3", "Related Topic 4"]
}

RULES:
1. Generate 3-6 sections covering the topic thoroughly
2. Include code examples where relevant (especially for programming topics)
3. Use simple, clear English
4. Always include at least 3 key points and 4 related topics
5. Make content educational, engaging, and easy to understand
6. Use proper HTML tags in the "content" field for formatting
7. RESPOND ONLY WITH THE JSON — no explanations, no markdown fences`;

// ── Hindi: Sarvam writes natural Hindi with markdown headings ──
const HINDI_SYSTEM_PROMPT = `तुम KnoblyAI हो — एक expert teacher हो जो students को बहुत आसान भाषा में पढ़ाते हो।

तुम्हें दिए गए topic को बहुत detail में, आसान और simple Hindi (Devanagari script) में explain करना है।

FORMAT RULES:
1. Title को # से शुरू करो (e.g. # CPU क्या है)
2. हर section को ## से शुरू करो (e.g. ## CPU कैसे काम करता है)
3. हर section में कम से कम 4-5 lines लिखो
4. Points के लिए - (dash) use करो
5. Code example हो तो \`\`\` में लिखो
6. कम से कम 4-5 sections लिखो
7. अंत में "## Key Points" section में 4-5 important points लिखो
8. सबसे last में "## Related Topics" में 4 related topics लिखो

LANGUAGE RULES (EXTREMELY IMPORTANT):
- बहुत ही SIMPLE और आसान Hindi लिखो, जैसे एक दोस्त बात कर रहा हो
- DIFFICULT HINDI WORDS बिल्कुल मत use करो (जैसे "संग्रहित", "उपकरण", "संरचना" मत लिखो)
- सभी TECHNICAL WORDS, PROPER NOUNS, और HARD WORDS को ENGLISH में ही लिखो (जैसे "CPU एक hardware device है", "data store होता है", "memory manage करती है")
- Tone friendly और relatable रखो, जैसे students से बात कर रहे हो`;

// ── Parse markdown response into structured content ──
function parseMarkdownToContent(markdown: string, topicFallback: string) {
    const lines = markdown.split('\n');
    const title = lines.find(l => l.startsWith('# '))?.replace(/^#+\s*/, '').trim() || topicFallback;
    
    const sections: { heading: string; content: string; code?: string; codeLanguage?: string; example?: string }[] = [];
    const keyPoints: string[] = [];
    const relatedTopics: string[] = [];
    
    let currentSection: { heading: string; lines: string[] } | null = null;
    let inKeyPoints = false;
    let inRelatedTopics = false;
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = '';
    
    for (const line of lines) {
        // Skip the title line
        if (line.startsWith('# ') && !line.startsWith('## ')) continue;
        
        // Code blocks
        if (line.trim().startsWith('```')) {
            if (!inCodeBlock) {
                inCodeBlock = true;
                codeLang = line.trim().replace('```', '').trim();
                codeLines = [];
            } else {
                inCodeBlock = false;
                if (currentSection) {
                    // Attach code to the current section
                    const sectionIdx = sections.length - 1;
                    if (sectionIdx >= 0) {
                        sections[sectionIdx].code = codeLines.join('\n');
                        sections[sectionIdx].codeLanguage = codeLang || 'python';
                    }
                }
            }
            continue;
        }
        
        if (inCodeBlock) {
            codeLines.push(line);
            continue;
        }
        
        // Section headings
        if (line.startsWith('## ')) {
            const heading = line.replace(/^#+\s*/, '').trim();
            
            // Check for special sections
            if (heading.toLowerCase().includes('key point') || heading.toLowerCase().includes('मुख्य') || heading.toLowerCase().includes('important point')) {
                inKeyPoints = true;
                inRelatedTopics = false;
                continue;
            }
            if (heading.toLowerCase().includes('related') || heading.toLowerCase().includes('संबंधित') || heading.toLowerCase().includes('और जानें')) {
                inRelatedTopics = true;
                inKeyPoints = false;
                continue;
            }
            
            // Save previous section
            if (currentSection && currentSection.lines.length > 0) {
                const content = currentSection.lines
                    .map(l => {
                        if (l.trim().startsWith('- ') || l.trim().startsWith('* ')) {
                            return `<li>${l.trim().replace(/^[-*]\s*/, '')}</li>`;
                        }
                        return l.trim() ? `<p>${l.trim()}</p>` : '';
                    })
                    .join('');
                // Wrap consecutive <li> tags in <ul>
                const wrappedContent = content.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
                sections.push({ heading: currentSection.heading, content: wrappedContent });
            }
            
            currentSection = { heading, lines: [] };
            inKeyPoints = false;
            inRelatedTopics = false;
            continue;
        }
        
        // Key Points
        if (inKeyPoints) {
            const cleaned = line.trim().replace(/^[-*•\d.)\s]+/, '').trim();
            if (cleaned) keyPoints.push(cleaned);
            continue;
        }
        
        // Related Topics
        if (inRelatedTopics) {
            const cleaned = line.trim().replace(/^[-*•\d.)\s]+/, '').trim();
            if (cleaned) relatedTopics.push(cleaned);
            continue;
        }
        
        // Regular content
        if (currentSection) {
            currentSection.lines.push(line);
        }
    }
    
    // Save last section
    if (currentSection && currentSection.lines.length > 0) {
        const content = currentSection.lines
            .map(l => {
                if (l.trim().startsWith('- ') || l.trim().startsWith('* ')) {
                    return `<li>${l.trim().replace(/^[-*]\s*/, '')}</li>`;
                }
                return l.trim() ? `<p>${l.trim()}</p>` : '';
            })
            .join('');
        const wrappedContent = content.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
        sections.push({ heading: currentSection.heading, content: wrappedContent });
    }
    
    // Build summary from first section content
    const summary = sections[0]?.content?.replace(/<[^>]*>/g, '').slice(0, 200) || '';
    
    return {
        title,
        summary,
        sections: sections.length > 0 ? sections : [{ heading: topicFallback, content: `<p>${markdown.replace(/\n/g, '<br/>')}</p>` }],
        keyPoints: keyPoints.length > 0 ? keyPoints : ['Topic explanation generated by AI'],
        relatedTopics,
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await readAIRequest(req);
        const topic = aiText(body, 'topic', AI_LIMITS.topic);
        const language = aiChoice(body, 'language', ['en', 'hi'] as const, 'en');
        const client = createAIClient(req.signal, { totalMs: 35000, attemptMs: 20000 });

        const isHindi = language === 'hi';

        // ═══════════════════════════════════════════
        // HINDI PATH: Sarvam AI (primary) → Groq (fallback)
        // Uses natural markdown output, not JSON
        // ═══════════════════════════════════════════
        if (isHindi) {
            const hindiUserMsg = `इस topic को बहुत detail में, आसान Hindi में explain करो: "${topic}"`;
            let markdownReply = '';

            // 1. Try Sarvam AI (best for Hindi)
            if (SARVAM_API_KEY) {
                console.log('[Generate Topic] 🇮🇳 Using Sarvam AI for Hindi...');
                try {
                    const sarvamRes = await client.fetch('https://api.sarvam.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'api-subscription-key': SARVAM_API_KEY,
                            'Authorization': `Bearer ${SARVAM_API_KEY}`
                        },
                        body: JSON.stringify({
                            model: 'sarvam-30b-16k',
                            messages: [
                                { role: 'system', content: HINDI_SYSTEM_PROMPT },
                                { role: 'user', content: hindiUserMsg }
                            ],
                            max_tokens: 4000,
                            temperature: 0.65
                        }),
                    }, 25000);

                    if (sarvamRes.ok) {
                        const data = await sarvamRes.json();
                        const text = data.choices?.[0]?.message?.content;
                        if (text && text.length > 100) {
                            markdownReply = text;
                            console.log('[Generate Topic] ✅ Sarvam AI Hindi generation successful, length:', text.length);
                        } else {
                            console.warn('[Generate Topic] Sarvam response too short, falling back...');
                        }
                    } else {
                        console.warn('[Generate Topic] Sarvam API status:', sarvamRes.status);
                    }
                } catch (err) {
                    console.warn('[Generate Topic] Sarvam AI timeout/error:', err);
                }
            }

            // 2. Fallback: Groq for Hindi (with same markdown format)
            if (!markdownReply) {
                console.log('[Generate Topic] 🔄 Falling back to Groq for Hindi...');
                try {
                    const groqRes = await client.fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${GROQ_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: 'openai/gpt-oss-120b',
                            messages: [
                                { role: 'system', content: HINDI_SYSTEM_PROMPT },
                                { role: 'user', content: hindiUserMsg },
                            ],
                            max_tokens: 4000,
                            temperature: 0.65,
                        }),
                    });

                    if (groqRes.ok) {
                        const data = await groqRes.json();
                        markdownReply = data.choices?.[0]?.message?.content ?? '';
                    } else {
                        console.error('[Generate Topic] Groq Hindi fallback also failed');
                        return aiErrorResponse(null);
                    }
                } catch (err) {
                    console.error('[Generate Topic] Groq Hindi error:', err);
                    return aiErrorResponse(err);
                }
            }

            // Parse markdown into structured content
            const content = parseMarkdownToContent(markdownReply, topic);
            return NextResponse.json({ content });
        }

        // ═══════════════════════════════════════════
        // ENGLISH PATH: Groq with JSON output
        // ═══════════════════════════════════════════
        console.log('[Generate Topic] 🇬🇧 Using Groq for English...');
        const groqRes = await client.fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-120b',
                messages: [
                    { role: 'system', content: ENGLISH_SYSTEM_PROMPT },
                    { role: 'user', content: `Explain this topic in detail in simple English: "${topic}"` },
                ],
                max_tokens: 3000,
                temperature: 0.6,
                response_format: { type: 'json_object' } // <-- Enforce valid JSON
            }),
        });

        if (!groqRes.ok) {
            return aiErrorResponse(null);
        }

        const data = await groqRes.json();
        const rawReply = data.choices?.[0]?.message?.content ?? '';

        // Parse JSON response
        try {
            const parsed = JSON.parse(rawReply);
            return NextResponse.json({ content: parsed });
        } catch (err) {
            console.error('Failed to parse English JSON directly, attempting to extract it.', err);
            try {
                const startIdx = rawReply.indexOf('{');
                const endIdx = rawReply.lastIndexOf('}');
                if (startIdx === -1 || endIdx === -1) throw new Error('No JSON found');
                const parsed = JSON.parse(rawReply.substring(startIdx, endIdx + 1));
                return NextResponse.json({ content: parsed });
            } catch {
                console.error('AI lesson response could not be parsed as JSON.');
                return NextResponse.json({
                    content: {
                        title: topic,
                        summary: 'AI-generated explanation',
                        sections: [{ heading: topic, content: `<pre style="white-space: pre-wrap; font-family: inherit; font-size: inherit;">${rawReply}</pre>` }],
                        keyPoints: [],
                        relatedTopics: [],
                    }
                });
            }
        }
    } catch (err) {
        return aiErrorResponse(err);
    }
}

