import { AIExplanation } from '@/types/python';
import { AIRequestError, createAIClient, type AIClient } from '@/lib/ai-request';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_KEY_ALT = process.env.GROQ_API_KEY_ALT;

async function fetchWithFallback(url: string, options: RequestInit, client: AIClient): Promise<Response> {
  const primaryKey = GROQ_API_KEY;
  const secondaryKey = GROQ_API_KEY_ALT;
  
  // Try with primary key first
  let response: Response | undefined;
  try {
    response = await client.fetch(url, {
      ...options,
      headers: { ...options.headers, 'Authorization': `Bearer ${primaryKey}` },
    });
  } catch (error) {
    if (error instanceof AIRequestError && error.status === 408) throw error;
  }

  // If failed (likely rate limit or quota), try fallback
  if (!response?.ok) {
    const fallbackKey = secondaryKey || primaryKey;
    console.warn('Primary request failed. Attempting fallback model/key...');
    
    const fallbackOptions = { ...options };
    if (fallbackOptions.body && typeof fallbackOptions.body === 'string') {
      try {
        const bodyObj = JSON.parse(fallbackOptions.body);
        if (bodyObj.model === 'openai/gpt-oss-120b') {
          bodyObj.model = 'openai/gpt-oss-20b';
          fallbackOptions.body = JSON.stringify(bodyObj);
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }

    response = await client.fetch(url, {
      ...fallbackOptions,
      headers: {
        ...fallbackOptions.headers,
        'Authorization': `Bearer ${fallbackKey}`,
      }
    });
  }
  
  return response;
}

export async function explainError(code: string, error: string, language: 'en' | 'hi', client: AIClient = createAIClient()): Promise<AIExplanation> {
  const isHindi = language === 'hi';
  
  const systemPrompt = isHindi
    ? `Tum ek Python expert aur teacher ho. User tumhe unka code aur error dega. 
Dhyan se sirf 'Error' message ko padho aur batao ki error kis line number par hai aur uska asli matlab kya hai.
Explanation thodi detail me do (2-3 lines me) taaki student ko samajh aaye ki galti kyun hui. Agar bracket band karna bhul gaye toh saaf batao ki kis line par bracket missing hai. 
Agar error 'NameError: name is not defined' hai aur user ne koi spelling mistake ki hai ya aise hi koi text likh diya hai, toh usko correct karne ya REMOVE karne ko kaho. Apne paas se extra code matt likho ya naye variables mat banao agar zaroori na ho.
!! STRICT RULE 1 !! Tumhara Pura Jawab SIRF Hindi ya Hinglish me hona chahiye. English me pura sentence mat likhna.
!! STRICT RULE 2 !! Python ke technical terms jaise "indentation", "variable", "string", "loop", "syntax", "brackets", "function" ko bilkul translate MAT karna. Unko English word hi rehne dena.
(Sahi Udaharan: "Line 2 par indentation missing hai", "is variable ko define karein", "print function me string band nahi hui")
(Galat Udaharan: "dabav lagayein", "char ka upyog karein", "sutrdhar Missing hai")
!! STRICT RULE 3 !! "corrected_code" me POORA COMPLETE code dena hai — sirf fix ki hui line nahi! User ka pura original code copy karo aur usme sirf error wali line ko fix karo. Baaki sab lines bilkul waisi hi rehni chahiye.
Sirf JSON do jisme ye chaar (4) keys hon: "error_type", "explanation", "how_to_fix", "corrected_code". In keys ki values me apna jawav (Hindi/Hinglish me) likho.`
    : `You are an expert Python teacher. The user will provide their code and complete error traceback.
READ EXACTLY WHAT THE ERROR SAYS. Explicitly mention the line number where the error occurred based on the traceback. Provide a helpful, clear explanation (2-3 sentences) of why the error happened and what it means, instead of just a brief summary.
If the error is a 'NameError' or resembles a typo/random text entered into the code, suggest they either correct the spelling or REMOVE the invalid text completely. DO NOT invent new variables, assign random values, or write arbitrary code they didn't ask for. Fix ONLY what is explicitly broken.
!! CRITICAL RULE !! The "corrected_code" field MUST contain the COMPLETE corrected program — ALL lines of the user's original code with ONLY the broken part fixed. Do NOT return just the fixed line alone. Copy the user's entire code and fix only the error.
Reply with ONLY JSON containing exactly four keys: "error_type", "explanation", "how_to_fix", "corrected_code". Put your actual response in the values of these keys.`;

  const userMessage = isHindi
    ? `Code:
${code}

Error:
${error}

Is error ko completely analyze karo aur mujhe proper JSON me answer do. IMPORTANT: Answer strictly HINDI (Hinglish) me hi dena hai, English bilkul allow nahi hai, lekin technical words ko English me hi likhna (no literal Hindi translations of technical concepts).
YAAD RAKHNA: "corrected_code" me POORA code dena hai — sirf fix line nahi! User ka pura code copy karo aur usme sirf error fix karo.
{"error_type": "", "explanation": "", "how_to_fix": "", "corrected_code": "<POORA CORRECTED CODE YAHAN>"}`
    : `Code:
${code}

Error Traceback:
${error}

Analyze the Error Traceback strictly! Do not guess. Fix ONLY what's broken in the code.
REMEMBER: "corrected_code" MUST contain the COMPLETE corrected program with ALL lines, not just the fixed line. Copy the entire original code and fix only the error.
Provide exactly this JSON structure with your custom answers:
{"error_type": "", "explanation": "", "how_to_fix": "", "corrected_code": "<FULL CORRECTED CODE HERE>"}`;

  const response = await fetchWithFallback('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 1000,
    }),
  }, client);

  if (!response.ok) {
    throw new AIRequestError(502, 'AI service is temporarily unavailable. Please try again.');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No response from AI');
  }


  try {
    let jsonStr = content.trim();
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '');
    
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found');
    }
    
    jsonStr = jsonMatch[0];
    jsonStr = jsonStr.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
    
    const parsed = JSON.parse(jsonStr);
    
    return {
      error_type: parsed.error_type || 'Error',
      error_line: parsed.error_line?.toString() || '',
      simple_explanation_english: isHindi ? '' : (parsed.explanation || ''),
      simple_explanation_hindi: isHindi ? (parsed.explanation || '') : '',
      why_error_happened: '',
      how_to_fix: parsed.how_to_fix || '',
      corrected_code: parsed.corrected_code || '',
    };
  } catch (parseErr) {
    console.error('Parse error:', parseErr);
    
    return {
      error_type: 'Error',
      error_line: '',
      simple_explanation_english: isHindi ? '' : 'Try again',
      simple_explanation_hindi: isHindi ? 'Dubara try karo' : '',
      why_error_happened: '',
      how_to_fix: 'Click Get AI Help button',
      corrected_code: code,
    };
  }
}

export async function generateCode(prompt: string, language: 'en' | 'hi', mode?: 'python' | 'c' | 'web', client: AIClient = createAIClient()): Promise<string> {
  const isHindi = language === 'hi';

  // Detect if user is asking for Web / HTML or C language
  const isWebLang = mode === 'web' || /\b(html|css|web page|website|web app|javascript dom|responsive navbar|flexbox|web design|landing page)\b/i.test(prompt);
  const isCLang = !isWebLang && (mode === 'c' || /\b(c language|c programming|in c\b|c mein|c lang)/i.test(prompt) || /^(Write this in C|Ye C language)/i.test(prompt));

  let systemPrompt: string;
  let userMessage: string;

  if (isWebLang) {
    systemPrompt = isHindi
      ? `Tum ek expert Frontend Web Developer ho. User ek web component, HTML structure, ya complete webpage banane ko bolega. Tumhe modern, visually stunning aur responsive HTML code likhna hai jisme internal <style> aur zaroorat padne par interactive <script> bhi shaamil ho. Code ke bahar koi text, greeting ya markdown backticks (\`\`\`html) mat dena. Sirf raw HTML return karo jo seedha browser preview mein run ho sake.`
      : `You are an expert Frontend Web Developer. The user will ask for a web component, webpage, or HTML layout. Return modern, clean, visually beautiful, and responsive HTML code with embedded <style> and interactive <script> where appropriate. Do not include markdown code block backticks (like \`\`\`html) or explanations. Return ONLY the raw HTML ready to render directly.`;
    userMessage = `Write modern HTML/CSS/JS code for: ${prompt}`;
  } else if (isCLang) {
    systemPrompt = isHindi
      ? `Tum ek expert C programmer ho. User ek question poochega aur tumhe sirf aur sirf us point par compile/run hone wala C code likhna hai. Code ke bahar koi text ya markdown backticks (\`\`\`) mat dena. Sirf plain text C code return karo taaki use seedha editor mein compile kiya ja sake.`
      : `You are an expert C programmer. The user will ask a programming question or request a program. You must return ONLY raw, compilable C code. Do not include any explanations, markdown formatting (like \`\`\`c), or wrapping text. The response should be ready to compile directly.`;
    userMessage = `Write C code for this: ${prompt}`;
  } else {
    systemPrompt = isHindi
      ? `Tum ek expert Python programmer ho. User ek question poochega aur tumhe sirf aur sirf us point par execute hone wala Python code likhna hai. Is problem ko sabse simple tareeke se solve karo. Functions (\`def\` keyword) ka bilkul use mat karna jab tak user khud na bole, ya bhut zyada zaroori na ho. Code ke bahar koi text ya markdown backticks (\`\`\`) mat dena. Sirf plain text code return karo taaki use seedha editor mein run kiya ja sake.`
      : `You are an expert Python programmer. The user will ask a programming question or request a script. You must return ONLY raw, executable Python code. Solve this in the simplest way possible. DO NOT use functions (\`def\` keyword) unless the user explicitly asks for one or it is strictly necessary. Do not include any explanations, markdown formatting (like \`\`\`python), or wrapping text. The response should be ready to run directly in an editor.`;
    userMessage = `Write python code for this: ${prompt}`;
  }

  const response = await fetchWithFallback('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 1500,
    }),
  }, client);

  if (!response.ok) {
    throw new AIRequestError(502, 'AI service is temporarily unavailable. Please try again.');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No response from AI');
  }

  // Clean the response if it incorrectly includes markdown block quotes
  let cleanedContent = content.trim();
  if (cleanedContent.startsWith('```html')) {
    cleanedContent = cleanedContent.replace(/^```html\s*/i, '');
  } else if (cleanedContent.startsWith('```python')) {
    cleanedContent = cleanedContent.replace(/^```python\s*/i, '');
  } else if (cleanedContent.startsWith('```c')) {
    cleanedContent = cleanedContent.replace(/^```c\s*/i, '');
  } else if (cleanedContent.startsWith('```')) {
    cleanedContent = cleanedContent.replace(/^```\s*/, '');
  }
  
  if (cleanedContent.endsWith('```')) {
    cleanedContent = cleanedContent.replace(/\s*```$/, '');
  }

  return cleanedContent.trim();
}

export async function explainWebCode(code: string, language: 'en' | 'hi', question?: string, client: AIClient = createAIClient()): Promise<{ explanation: string; how_to_fix: string; corrected_code: string }> {
  const isHindi = language === 'hi';
  const systemPrompt = isHindi
    ? `Tum ek friendly HTML/CSS/JavaScript web development teacher ho. Student ka HTML/CSS/JS code dekho aur use Hindi/Hinglish me explain karo. Code me agar koi galti hai ya improvement ka scope hai toh clearly samjhao. Output strictly JSON me do jisme "explanation", "how_to_fix", aur "corrected_code" (pura corrected HTML code) ho.`
    : `You are an expert HTML, CSS, and JavaScript web development mentor. Analyze the student's code, explain how it works or what can be improved, and fix any errors. Return strictly a JSON object with keys "explanation", "how_to_fix", and "corrected_code" (containing the full improved/fixed code).`;

  const userPrompt = `${question ? `Question: ${question}\n\n` : ''}Code:\n${code}`;

  const response = await fetchWithFallback('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 1500,
    }),
  }, client);

  if (!response.ok) {
    throw new AIRequestError(502, 'AI service is temporarily unavailable. Please try again.');
  }

  const data = await response.json();
  const raw = data.choices[0]?.message?.content;
  try {
    const parsed = JSON.parse(raw);
    return {
      explanation: parsed.explanation || '',
      how_to_fix: parsed.how_to_fix || '',
      corrected_code: parsed.corrected_code || code,
    };
  } catch (e) {
    return {
      explanation: raw || '',
      how_to_fix: '',
      corrected_code: code,
    };
  }
}
