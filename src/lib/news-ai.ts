// ========================================
// AI Provider: Sarvam AI (Primary) + Groq (Fallback)
// For News App - Top 10 Daily News
// ========================================

interface AIResponse {
  daily_summary_en?: string;
  daily_summary_hi?: string;
  top_news: any[];
}

async function callSarvamAI(prompt: string): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) throw new Error("SARVAM_API_KEY is not set");

  console.log("📡 Calling Sarvam AI with model sarvam-m...");

  const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      model: "sarvam-30b-16k",
      temperature: 0,
      max_tokens: 4000,
    }),
    signal: AbortSignal.timeout(15000), // Prevent hanging
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    console.error("❌ Sarvam response body:", errBody);
    throw new Error(`Sarvam AI returned status ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  console.log("✅ Sarvam AI raw response length:", content.length);
  return content;
}

async function callGroqAI(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  console.log("📡 Calling Groq AI with model openai/gpt-oss-120b...");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
      temperature: 0,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    console.error("❌ Groq response body:", errBody);
    throw new Error(`Groq API returned status ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  console.log("✅ Groq AI raw response length:", content.length);
  return content;
}

function buildPrompt(articles: any[]): string {
  const articlesText = articles.map((article, index) => `
[ID: article_${index}] Title: ${article.title}
Description: ${article.description || "N/A"}
  `).join("\n");

  return `You are an expert global news analyst and factual explainer.

You will be given a list of news articles.

Your task is to analyze and organize them into a structured TOP 10 news list with strict category rules.

---

## CATEGORY STRUCTURE (VERY IMPORTANT):

Select EXACTLY 10 news in this order:
1-3 -> TECHNOLOGY NEWS (AI, startups, gadgets, innovation)
4-6 -> INDIA NEWS (important national updates, policies, economy, tech, events)
7-9 -> WORLD NEWS (global events, science, major incidents, breakthroughs)
10 -> SPORTS NEWS (important global or India sports update)

---

## SELECTION RULES:
* Choose only HIGH-QUALITY and IMPORTANT news
* Prefer innovation, new technology, major events
* Avoid gossip, minor updates, controversy
* Ensure diversity (don't pick similar news)

---

## LANGUAGE RULES (VERY IMPORTANT):

You MUST provide BOTH:
1. English version
2. Hindi version

### Hindi Rules (MOST CRITICAL — READ CAREFULLY):

Write Hindi in DEVANAGARI SCRIPT (हिंदी लिपि) but use ONLY very simple, everyday spoken Hindi words.

STRICT RULES:
* Write in हिंदी लिपि (Devanagari), NOT in Roman/English script
* Use ONLY simple daily-use Hindi words that a 10 year old child can understand
* NEVER use difficult, literary, bookish, or formal Hindi words
* If any Hindi word feels even slightly difficult → replace it with the English word written in Devanagari (e.g., "टेक्नोलॉजी", "कंपनी", "प्रोडक्ट", "लॉन्च")
* Keep sentences VERY SHORT (max 10-12 words per sentence)
* Use casual spoken tone, like explaining to a friend

EXAMPLES OF WHAT TO DO:

❌ BAD (difficult): "यह एक अभूतपूर्व तकनीकी उपलब्धि है"
✅ GOOD (simple): "यह एक बहुत बड़ी टेक्नोलॉजी अचीवमेंट है"

❌ BAD: "इस उत्पाद का अनावरण किया गया"
✅ GOOD: "यह नया प्रोडक्ट लॉन्च हुआ है"

❌ BAD: "विशेषज्ञों का मानना है कि यह क्रांतिकारी है"
✅ GOOD: "एक्सपर्ट्स कह रहे हैं कि यह बहुत बड़ा चेंज है"

❌ BAD: "सरकार ने नवीन नीति की घोषणा की"
✅ GOOD: "सरकार ने नई पॉलिसी अनाउंस की है"

❌ BAD: "अर्थव्यवस्था में सुधार"
✅ GOOD: "इकॉनमी बेहतर हो रही है"

---

### TITLE RULE (IMPORTANT):
* Provide BOTH titles:
  - title_en: (original clean title in English)
  - title_hi: (translated in SIMPLE Hindi using Devanagari script, short, easy, natural. Use English words in Devanagari where needed)

---

## STRICT ACCURACY RULES:
* Use ONLY the provided news content
* DO NOT add extra facts
* DO NOT hallucinate
* Keep everything factual and simple

---

Return ONLY a valid JSON object with the following structure:
1. "daily_summary_en" (string: A 3-4 line engaging summary explaining what all these 10 news stories are generally about today).
2. "daily_summary_hi" (string: Same summary translated into SIMPLE Hindi using Devanagari, explaining the overall theme of today's news).
3. "top_news" (array of exactly 10 objects).

Each object in the "top_news" array must have exactly these keys:
- "article_id" (string: MUST be the exact ID from the [ ] brackets, e.g. "article_5")
- "original_title" (string: the EXACT title of the original article)
- "category" (string: "Tech", "India", "World", or "Sports")
- "title_en" (string: clean English title)
- "title_hi" (string: simple Hindi/Hinglish title in Devanagari)
- "english" (string: 2-3 line explanation in English)
- "hindi" (string: 2-3 line explanation in SIMPLE Hindi in Devanagari script)

Clean JSON only, no markdown formatting like \`\`\`json.

---

## NEWS LIST:

${articlesText}`;
}

function parseAIResponse(rawContent: string): AIResponse {
  // Remove <think> tags and their contents (used by reasoning models)
  const cleanedContent = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '');
  
  // Remove markdown code blocks
  let jsonStr = cleanedContent.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();
  
  // Extract just the JSON object from the string
  const start = jsonStr.indexOf("{");
  const end = jsonStr.lastIndexOf("}");
  
  if (start !== -1 && end !== -1) {
    jsonStr = jsonStr.substring(start, end + 1);
  }

  return JSON.parse(jsonStr);
}

export async function getNewsAIExplanation(articles: any[]): Promise<AIResponse> {
  const prompt = buildPrompt(articles);

  // PRIMARY: Try Sarvam AI first
  try {
    console.log("🟢 Trying Sarvam AI (primary)...");
    const rawContent = await callSarvamAI(prompt);
    const parsed = parseAIResponse(rawContent);
    console.log("✅ Sarvam AI succeeded! Got", parsed.top_news?.length, "news items");
    return parsed;
  } catch (sarvamError: any) {
    console.warn("⚠️ Sarvam AI failed:", sarvamError.message);
  }

  // FALLBACK: Try Groq
  try {
    console.log("🟡 Falling back to Groq...");
    const rawContent = await callGroqAI(prompt);
    const parsed = parseAIResponse(rawContent);
    console.log("✅ Groq succeeded as fallback! Got", parsed.top_news?.length, "news items");
    return parsed;
  } catch (groqError: any) {
    console.error("❌ Groq also failed:", groqError.message);
  }

  throw new Error("Both Sarvam AI and Groq failed to process the news.");
}
