import { NextResponse } from 'next/server';
import { AI_LIMITS, AIRequestError, aiErrorResponse, aiText, createAIClient, readAIRequest, type AIClient } from '@/lib/ai-request';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_KEY_ALT = process.env.GROQ_API_KEY_ALT;

interface FlexibleTagGroup {
  label: string;
  tags: string[];
}

interface TaskDefinition {
  id: string;
  title: string;
  desc: string;
  topics: string;
  requiredTags: string[];
  optionalHeadings?: string[];
  mediaTags?: string[];
  formTypes?: string[];
  requiredAttrs?: string[];
  flexibleTagGroups?: FlexibleTagGroup[];
  keywords: string[];
}

const TASKS_MAP: Record<string, TaskDefinition> = {
  '1': {
    id: '1',
    title: 'My Profile Page',
    desc: 'Create a personal profile using basic HTML tags: p, pre, br, hr',
    topics: 'p, pre, br, hr, bgcolor',
    requiredTags: ['p', 'pre', 'br', 'hr'],
    requiredAttrs: ['bgcolor'],
    keywords: ['profile', 'bio', 'quote', 'contact', 'name', 'about', 'email', 'developer']
  },
  '2': {
    id: '2',
    title: 'Basic HTML Tags',
    desc: 'Demonstrate bold, italic, underline, pre, br, center and heading tags',
    topics: 'b, i, u, pre, br, center, h1, h2, hr',
    requiredTags: ['b', 'i', 'u', 'pre', 'br', 'center', 'hr'],
    optionalHeadings: ['h1', 'h2', 'h3'],
    keywords: ['heading', 'bold', 'italic', 'underline', 'center', 'html', 'tags']
  },
  '3': {
    id: '3',
    title: 'India - A Diverse Nation',
    desc: 'Article about India using headings, images, font colors, and hr',
    topics: 'h1-h5, img, font, br, hr, align',
    requiredTags: ['img', 'font', 'br', 'hr'],
    optionalHeadings: ['h1', 'h2', 'h3', 'h4', 'h5'],
    requiredAttrs: ['align'],
    keywords: ['india', 'nation', 'cities', 'delhi', 'mumbai', 'capital', 'map', 'heritage', 'culture', 'states']
  },
  '4': {
    id: '4',
    title: 'Indian History Timeline',
    desc: 'History page using semantic elements or timeline structure with marquee, font, hr',
    topics: 'header, nav, section, footer, address, ul, marquee, font, img, hr',
    requiredTags: ['hr'],
    flexibleTagGroups: [
      { label: 'header/h1', tags: ['header', 'h1'] },
      { label: 'nav/marquee/links', tags: ['nav', 'marquee', 'a', 'ul'] },
      { label: 'section/h2/article', tags: ['section', 'h2', 'article'] },
      { label: 'footer/address/p', tags: ['footer', 'address', 'p'] },
      { label: 'font/img', tags: ['font', 'img'] },
    ],
    keywords: ['history', 'timeline', 'ancient', 'medieval', 'modern', 'india', 'empire', 'freedom', 'period']
  },
  '5': {
    id: '5',
    title: 'Operating Systems (Lists)',
    desc: 'OS information page with unordered and ordered lists',
    topics: 'ul, ol, li, h1-h3, p, hr',
    requiredTags: ['ul', 'ol', 'li', 'p', 'hr'],
    optionalHeadings: ['h1', 'h2', 'h3'],
    keywords: ['operating system', 'windows', 'linux', 'macos', 'android', 'os', 'process', 'management']
  },
  '5.0': {
    id: '5.0',
    title: 'Web Dev Roadmap (Nested Lists)',
    desc: 'Multi-level learning roadmap using nested unordered, ordered, and description lists',
    topics: 'ul, ol, li, dl, dt, dd, type, h1-h3, p, hr',
    requiredTags: ['ul', 'ol', 'li', 'dl', 'dt', 'dd', 'p', 'hr'],
    optionalHeadings: ['h1', 'h2', 'h3'],
    requiredAttrs: ['type'],
    keywords: ['frontend', 'backend', 'development', 'html', 'css', 'javascript', 'roadmap', 'database', 'tools', 'api', 'dom']
  },
  '5.1': {
    id: '5.1',
    title: 'Operating Systems (Table)',
    desc: 'OS comparison using tables with borders and cellpadding',
    topics: 'table, tr, th, td, border, cellpadding',
    requiredTags: ['table', 'tr', 'th', 'td'],
    requiredAttrs: ['border', 'cellpadding'],
    keywords: ['operating system', 'os', 'table', 'features', 'license', 'developer', 'type']
  },
  '5.2': {
    id: '5.2',
    title: 'Internet Usage Statistics',
    desc: 'Global internet stats with colspan and rowspan tables',
    topics: 'table, colspan, rowspan, th, td, caption',
    requiredTags: ['table', 'tr', 'th', 'td', 'caption'],
    requiredAttrs: ['colspan', 'rowspan'],
    keywords: ['internet', 'statistics', 'users', 'global', 'data', 'world', 'population', 'growth']
  },
  '5.3': {
    id: '5.3',
    title: 'History of the Internet',
    desc: 'Internet timeline with description lists and tables',
    topics: 'dl, dt, dd, table, iframe, ol',
    requiredTags: ['dl', 'dt', 'dd', 'table', 'tr', 'td'],
    flexibleTagGroups: [
      { label: 'ol/ul/list', tags: ['ol', 'ul', 'li'] },
      { label: 'iframe/a/p', tags: ['iframe', 'a', 'p'] },
    ],
    keywords: ['internet', 'history', 'arpanet', 'timeline', 'web', 'network', 'cerf', 'berners-lee']
  },
  '5.4': {
    id: '5.4',
    title: 'Wonders of Space',
    desc: 'Space exploration page with images, tables, and multimedia',
    topics: 'img, table, audio, video, iframe',
    requiredTags: ['img', 'table', 'tr', 'td'],
    mediaTags: ['audio', 'video', 'iframe'],
    keywords: ['space', 'planet', 'moon', 'mars', 'nasa', 'isro', 'galaxy', 'exploration', 'stars']
  },
  '6': {
    id: '6',
    title: 'Weekly Study Schedule',
    desc: 'Complex table with colspan, rowspan, and colored cells',
    topics: 'table, colspan, rowspan, bgcolor, th, td',
    requiredTags: ['table', 'tr', 'th', 'td'],
    requiredAttrs: ['colspan', 'rowspan', 'bgcolor'],
    keywords: ['schedule', 'monday', 'tuesday', 'time', 'study', 'class', 'subject', 'period', 'session']
  },
  '7': {
    id: '7',
    title: 'Simple Webpage (No CSS)',
    desc: 'Complete webpage using only semantic HTML tags, no CSS',
    topics: 'header, nav, main, article, section, footer',
    requiredTags: ['h1', 'p', 'a', 'ul', 'li', 'hr'],
    optionalHeadings: ['h1', 'h2', 'h3'],
    keywords: ['simple', 'webpage', 'navigation', 'about', 'features', 'contact', 'learn', 'html']
  },
  '8': {
    id: '8',
    title: 'Registration Form',
    desc: 'Complete registration form with all input types',
    topics: 'form, input, select, textarea, radio, checkbox',
    requiredTags: ['form', 'input', 'select', 'textarea'],
    formTypes: ['radio', 'checkbox'],
    keywords: ['registration', 'form', 'name', 'email', 'password', 'gender', 'submit', 'country']
  },
  '9': {
    id: '9',
    title: 'Solar System Basics',
    desc: 'Solar system page with tables, lists, and audio',
    topics: 'table, ol, ul, audio, img, details',
    requiredTags: ['table', 'tr', 'td', 'img'],
    flexibleTagGroups: [
      { label: 'ol/ul/list', tags: ['ol', 'ul', 'li'] },
      { label: 'audio/video/details', tags: ['audio', 'video', 'details', 'summary'] },
    ],
    keywords: ['solar system', 'sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'planet', 'orbit']
  },
  '10': {
    id: '10',
    title: 'Full Website Layout',
    desc: 'Multi-section website with marquee, nav, tables, forms, media',
    topics: 'marquee, nav, table, form, video, iframe',
    requiredTags: ['marquee', 'table', 'tr', 'td', 'form'],
    flexibleTagGroups: [
      { label: 'nav/links', tags: ['nav', 'ul', 'a'] },
      { label: 'video/iframe/img', tags: ['video', 'iframe', 'img'] },
    ],
    keywords: ['website', 'layout', 'home', 'services', 'contact', 'news', 'about', 'navigation']
  },
  '11': {
    id: '11',
    title: 'Premium Demo Website',
    desc: 'Professional-looking demo site with header, sections, and footer',
    topics: 'header, section, article, aside, footer, figure',
    requiredTags: ['header', 'table', 'p', 'a'],
    optionalHeadings: ['h1', 'h2', 'h3'],
    keywords: ['demo', 'premium', 'services', 'portfolio', 'quality', 'features', 'contact', 'welcome']
  },
  'test-1': {
    id: 'test-1',
    title: 'Test - 1: Foundation & Lists Mastery',
    desc: 'Comprehensive test covering all tags up to lists: headings, paragraphs, pre, formatting, marquee, images, anchor links, unordered, ordered, nested, and description lists.',
    topics: 'h1-h3, p, pre, b, i, u, mark, marquee, img, a, ul, ol, dl, dt, dd, font, hr, bgcolor, align, href, src',
    requiredTags: ['h1', 'p', 'pre', 'hr', 'a', 'img', 'marquee', 'ul', 'ol', 'li', 'dl', 'dt', 'dd'],
    optionalHeadings: ['h1', 'h2', 'h3'],
    requiredAttrs: ['href', 'src', 'align', 'color'],
    keywords: ['institute', 'academy', 'technology', 'education', 'admissions', 'course', 'syllabus', 'frontend', 'glossary', 'schedule']
  },
};

interface DeterministicEvaluation {
  score: number;
  grade: string;
  tagAnalysis: {
    used: string[];
    missing: string[];
    extra: string[];
  };
  detailedBreakdown: {
    tagUsage: number;
    structure: number;
    contentRelevance: number;
    codeQuality: number;
    creativity: number;
  };
}

/**
 * High-accuracy deterministic HTML analyzer.
 * Calculates tag analysis, structure, content relevance, code quality and creativity
 * using exact rules so the score NEVER fluctuates for identical submissions.
 */
function analyzeCodeDeterministically(task: TaskDefinition, studentCode: string): DeterministicEvaluation {
  const code = (studentCode || '').trim();
  const lowerCode = code.toLowerCase();

  // 1. Tag extraction
  const tagMatches = code.match(/<\s*([a-zA-Z0-9]+)(\s|>|\/)/g) || [];
  const foundTags = new Set(
    tagMatches.map(t => t.replace(/[<\s>/]/g, '').toLowerCase())
  );

  const hasAttr = (attr: string) => new RegExp(`\\b${attr}\\s*=`, 'i').test(code);

  const usedTags: string[] = [];
  const missingTags: string[] = [];

  // Required tags check
  task.requiredTags.forEach(tag => {
    if (foundTags.has(tag.toLowerCase())) {
      usedTags.push(tag);
    } else {
      missingTags.push(tag);
    }
  });

  // Optional headings check (e.g. h1-h5)
  if (task.optionalHeadings) {
    const headingUsed = task.optionalHeadings.filter(h => foundTags.has(h));
    if (headingUsed.length >= 2) {
      usedTags.push(headingUsed.join('/'));
    } else if (headingUsed.length === 1) {
      usedTags.push(headingUsed[0]);
    } else {
      missingTags.push('headings (h1-h5)');
    }
  }

  // Media tags check
  if (task.mediaTags) {
    const mediaUsed = task.mediaTags.filter(m => foundTags.has(m));
    if (mediaUsed.length > 0) {
      usedTags.push(mediaUsed.join('/'));
    } else {
      missingTags.push(task.mediaTags.join('/'));
    }
  }

  // Flexible tag groups check
  if (task.flexibleTagGroups) {
    task.flexibleTagGroups.forEach(grp => {
      const match = grp.tags.find(t => foundTags.has(t.toLowerCase()));
      if (match) {
        usedTags.push(match);
      } else {
        missingTags.push(grp.label);
      }
    });
  }

  // Form input types check
  if (task.formTypes) {
    task.formTypes.forEach(ft => {
      const regex = new RegExp(`type\\s*=\\s*["']?${ft}["']?`, 'i');
      if (regex.test(code)) {
        usedTags.push(`input type="${ft}"`);
      } else {
        missingTags.push(`input type="${ft}"`);
      }
    });
  }

  // Required attributes check (bgcolor, align, border, colspan, etc.)
  if (task.requiredAttrs) {
    task.requiredAttrs.forEach(attr => {
      if (hasAttr(attr)) {
        usedTags.push(`[${attr}]`);
      } else {
        missingTags.push(`[${attr}]`);
      }
    });
  }

  // Extra tags used
  const standardSet = new Set([
    'html', 'head', 'title', 'body', '!doctype',
    ...task.requiredTags.map(t => t.toLowerCase()),
    ...(task.optionalHeadings || []).map(t => t.toLowerCase()),
    ...(task.mediaTags || []).map(t => t.toLowerCase()),
    ...(task.formTypes || []).map(t => t.toLowerCase())
  ]);
  const extraTags = Array.from(foundTags).filter(t => !standardSet.has(t));

  // 2. Score Categories
  // Tag Usage (40 points)
  const totalTargetItems = usedTags.length + missingTags.length;
  const tagUsageScore = totalTargetItems > 0
    ? Math.round((usedTags.length / totalTargetItems) * 40)
    : 0;

  // Structure Score (20 points)
  let structureScore = 0;
  if (/<!doctype\s+html/i.test(code)) structureScore += 4;
  if (/<html[\s>]/i.test(code) && /<\/html>/i.test(code)) structureScore += 4;
  if (/<head[\s>]/i.test(code) && /<\/head>/i.test(code)) structureScore += 4;
  if (/<title[\s>][\s\S]*?<\/title>/i.test(code)) structureScore += 4;
  if (/<body[\s>]/i.test(code) && /<\/body>/i.test(code)) structureScore += 4;

  // Content Relevance & Effort (20 points)
  const textContent = code.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  let contentScore = 0;
  if (textContent.length > 10) contentScore += 4;
  if (textContent.length > 60) contentScore += 6;
  if (textContent.length > 150) contentScore += 4;

  const matchedKeywords = (task.keywords || []).filter(kw => lowerCode.includes(kw.toLowerCase()));
  if (matchedKeywords.length >= 1) contentScore += 2;
  if (matchedKeywords.length >= 3) contentScore += 4;
  contentScore = Math.min(20, contentScore);

  // Code Quality (10 points)
  let codeQualityScore = 10;
  ['table', 'form', 'p', 'div', 'ul', 'ol', 'pre'].forEach(t => {
    const opens = (lowerCode.match(new RegExp(`<${t}[\\s>]`, 'g')) || []).length;
    const closes = (lowerCode.match(new RegExp(`</${t}>`, 'g')) || []).length;
    if (opens > closes) codeQualityScore -= 2;
  });
  if (code.includes('<') && code.split('<').length !== code.split('>').length) {
    codeQualityScore -= 2;
  }
  codeQualityScore = Math.max(3, Math.min(10, codeQualityScore));

  // Creativity (10 points)
  const creativityScore = Math.min(10, Math.floor(extraTags.length * 2.5) + (code.length > 500 ? 3 : 1));

  // Total Score (0-100)
  let totalScore = tagUsageScore + structureScore + contentScore + codeQualityScore + creativityScore;
  if (textContent.length < 5 && usedTags.length <= 1) {
    totalScore = Math.min(totalScore, 10);
  }
  totalScore = Math.max(0, Math.min(100, totalScore));

  let grade = 'F';
  if (totalScore >= 90) grade = 'A+';
  else if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 70) grade = 'B+';
  else if (totalScore >= 60) grade = 'B';
  else if (totalScore >= 50) grade = 'C';
  else if (totalScore >= 35) grade = 'D';

  return {
    score: totalScore,
    grade,
    tagAnalysis: {
      used: usedTags,
      missing: missingTags,
      extra: extraTags.slice(0, 8),
    },
    detailedBreakdown: {
      tagUsage: tagUsageScore,
      structure: structureScore,
      contentRelevance: contentScore,
      codeQuality: codeQualityScore,
      creativity: creativityScore,
    }
  };
}

/**
 * High-quality fallback Hinglish teacher feedback generator.
 * Runs instantly if AI is unavailable, rate-limited, or fails.
 */
function generateRuleBasedFeedback(taskTitle: string, deterministic: DeterministicEvaluation) {
  const { score, grade, tagAnalysis } = deterministic;
  const missingClean = tagAnalysis.missing.slice(0, 3).map(t => {
    const clean = t.replace(/[\[\]]/g, '');
    return clean.startsWith('input') ? clean : `<${clean}>`;
  });
  const missingStr = missingClean.join(', ');

  const usedClean = tagAnalysis.used.slice(0, 4).map(t => {
    const clean = t.replace(/[\[\]]/g, '');
    return clean.startsWith('input') ? clean : `<${clean}>`;
  });

  let feedback = '';
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (score >= 85) {
    feedback = `Shandar kaam! Aapne "${taskTitle}" ko behtareen tareeqe se complete kiya hai (Grade ${grade}). HTML structure aur required tags ka upyog bilkul standard ke anusaar hai.`;
    strengths.push('HTML5 standard structure (doctype, head, body) properly implemented hai.');
    strengths.push(`Required tags jaise ${usedClean.join(', ')} sahi jagah use kiye hain.`);
    improvements.push('Visual presentation ko aur behtar banane ke liye attributes aur neat spacing par dhyan dein.');
    improvements.push('Page ko aur professional banane ke liye extra content aur styling tags add kar sakte hain.');
  } else if (score >= 60) {
    feedback = `Accha prayas! Task "${taskTitle}" me aapne core tags shamil kiye hain (Grade ${grade}), lekin abhi kuch zaroori elements ${missingStr ? `jaise ${missingStr}` : ''} add karna baaki hai.`;
    strengths.push('Basic HTML page ka layout aur topic se related content accha hai.');
    strengths.push(`Used tags: ${usedClean.join(', ') || 'headings aur paragraphs'} ka syntax sahi hai.`);
    if (missingStr) {
      improvements.push(`Target task ke anusaar bache hue elements ${missingStr} ko apne code me zaroor jodein.`);
    }
    improvements.push('HTML structure (<!DOCTYPE>, <html>, <head>, <title>, <body>) ko verify karein taaki full marks milein.');
  } else if (score >= 35) {
    feedback = `Aapne Task "${taskTitle}" par kaam shuru kar diya hai (Grade ${grade}). Isko target reference jaisa banane ke liye missing tags aur complete structure jodein.`;
    strengths.push('Code likhne ki shuruat ki hai aur basic HTML tags lagaye hain.');
    improvements.push(`Zaroori elements add karein: ${missingStr || 'table / list / semantic elements'}.`);
    improvements.push('"Target Task" tab me reference output dekhkar step-by-step code karein.');
  } else {
    feedback = `Task "${taskTitle}" ke liye abhi kaafi tags missing hain. "Target Task" tab dekhein aur step-by-step tags likhna shuru karein!`;
    strengths.push('Editor me code likhna start kiya hai.');
    improvements.push('Pehle HTML boilerplate (<!DOCTYPE html>, <html>, <head>, <title>, <body>) banayein.');
    if (missingStr) {
      improvements.push(`Task ke main tags ${missingStr} ko body ke andar add karein.`);
    }
  }

  return { feedback, strengths, improvements };
}

/**
 * Super-fast, token-efficient AI teacher call using Groq.
 * Uses qwen/qwen3.8-27b (fast, ~300ms, zero reasoning waste, ~200 tokens total),
 * with fallback to openai/gpt-oss-20b and GROQ_API_KEY_ALT.
 */
async function fetchAiTeacherFeedback(
  taskTitle: string,
  deterministic: DeterministicEvaluation,
  studentSnippet: string,
  client: AIClient,
): Promise<{ feedback: string; strengths: string[]; improvements: string[] } | null> {
  const keys = [GROQ_API_KEY, GROQ_API_KEY_ALT].filter(Boolean) as string[];
  if (keys.length === 0) return null;

  // Ultra-compact prompt to minimize tokens (< 70 prompt tokens)
  const systemPrompt = `You are a friendly HTML teacher for Indian O-Level students.
Given the pre-evaluated score and tag analysis, provide encouraging, concise Hinglish teacher feedback.
Return STRICT JSON ONLY:
{
  "feedback": "<2-3 lines warm, motivating summary in Hinglish>",
  "strengths": ["<strength 1 in Hinglish>", "<strength 2 in Hinglish>"],
  "improvements": ["<actionable tip 1 in Hinglish>", "<actionable tip 2 in Hinglish>"]
}`;

  const userPrompt = `Task: "${taskTitle}"
Score: ${deterministic.score}/100 (Grade: ${deterministic.grade})
Tags used: ${deterministic.tagAnalysis.used.slice(0, 6).join(', ') || 'None'}
Missing tags: ${deterministic.tagAnalysis.missing.slice(0, 4).join(', ') || 'None'}
Code snippet:
${studentSnippet.slice(0, 400)}`;

  // Priority models: qwen3.8-27b is superfast and doesn't waste reasoning tokens
  const models = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];

  for (const key of keys) {
    for (const model of models) {
      try {
        const response = await client.fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.1,
            max_tokens: 300,
            response_format: { type: 'json_object' }
          }),
        }, 4000);

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            let jsonStr = content.trim();
            const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (match) jsonStr = match[1].trim();

            const parsed = JSON.parse(jsonStr);
            if (parsed.feedback && Array.isArray(parsed.strengths) && Array.isArray(parsed.improvements)) {
              return {
                feedback: String(parsed.feedback),
                strengths: parsed.strengths.slice(0, 3).map(String),
                improvements: parsed.improvements.slice(0, 3).map(String),
              };
            }
          }
        }
      } catch (e) {
        // Continue to fallback model or key
        console.warn(`[AI Eval] Model ${model} failed, trying next fallback...`);
      }
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await readAIRequest(req);
    const taskId = aiText(body, 'taskId', 30);
    const studentCode = aiText(body, 'studentCode', AI_LIMITS.code, { allowEmpty: true });
    if (!Object.hasOwn(TASKS_MAP, taskId)) throw new AIRequestError(404, 'Task not found.');
    const task = TASKS_MAP[taskId];
    const client = createAIClient(req.signal, { totalMs: 8000, attemptMs: 4000 });

    // 1. Calculate deterministic score & rubric (100% consistent across submits)
    const deterministic = analyzeCodeDeterministically(task, studentCode);

    // 2. Try fast AI Teacher for warm personalized Hinglish feedback
    let teacherFeedback: { feedback: string; strengths: string[]; improvements: string[] } | null = null;
    try {
      if (studentCode.trim()) teacherFeedback = await fetchAiTeacherFeedback(task.title, deterministic, studentCode, client);
    } catch (aiErr) {
      console.warn('[AI Eval] AI service error, falling back to rule-based engine:', aiErr);
    }

    // 3. Seamless Rule-Based Fallback if AI was unavailable or timed out
    if (!teacherFeedback) {
      teacherFeedback = generateRuleBasedFeedback(task.title, deterministic);
    }

    // 4. Combine into final evaluation response
    const evaluation = {
      score: deterministic.score,
      grade: deterministic.grade,
      tagAnalysis: deterministic.tagAnalysis,
      feedback: teacherFeedback.feedback,
      strengths: teacherFeedback.strengths,
      improvements: teacherFeedback.improvements,
      detailedBreakdown: deterministic.detailedBreakdown,
    };

    return NextResponse.json({
      evaluation,
      taskId: task.id,
      taskTitle: task.title,
      success: true
    });

  } catch (error) {
    return aiErrorResponse(error);
  }
}
