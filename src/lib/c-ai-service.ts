import { CAIExplanation } from '@/types/c-lang';
import { AIRequestError, createAIClient, type AIClient } from '@/lib/ai-request';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_KEY_ALT = process.env.GROQ_API_KEY_ALT;

async function fetchWithFallback(url: string, options: RequestInit, client: AIClient): Promise<Response> {
  const primaryKey = GROQ_API_KEY;
  const secondaryKey = GROQ_API_KEY_ALT;
  
  let response: Response;
  try {
    response = await client.fetch(url, {
      ...options,
      headers: { ...options.headers, 'Authorization': `Bearer ${primaryKey}` },
    });
  } catch (error) {
    if (!secondaryKey || (error instanceof AIRequestError && error.status === 408)) throw error;
    return client.fetch(url, {
      ...options,
      headers: { ...options.headers, 'Authorization': `Bearer ${secondaryKey}` },
    });
  }

  if (!response.ok && secondaryKey) {
    console.warn('Primary Groq API Key failed. Attempting fallback...');
    response = await client.fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${secondaryKey}`,
      }
    });
  }
  
  return response;
}

export async function explainCError(code: string, error: string, language: 'en' | 'hi', client: AIClient = createAIClient()): Promise<CAIExplanation> {
  const isHindi = language === 'hi';
  
  const systemPrompt = isHindi
    ? `Tum ek C programming expert aur teacher ho. User tumhe unka C code aur error dega. 
Dhyan se sirf 'Error' message ko padho aur batao ki error kis line number par hai aur uska asli matlab kya hai.
Explanation thodi detail me do (2-3 lines me) taaki student ko samajh aaye ki galti kyun hui.
!! STRICT RULE 1 !! Tumhara Pura Jawab SIRF Hindi ya Hinglish me hona chahiye. English me pura sentence mat likhna.
!! STRICT RULE 2 !! C ke technical terms jaise "pointer", "variable", "string", "loop", "syntax", "array", "function", "struct", "int", "char", "float", "printf", "scanf" ko bilkul translate MAT karna. Unko English word hi rehne dena.
!! STRICT RULE 3 !! "corrected_code" me POORA COMPLETE code dena hai. Agar user ne sirf ek line likhi hai (jaise sirf 'printf("H");') aur usme C ka basic structure (jaise '#include <stdio.h>' aur 'int main()') missing hai, toh tumhe khud wo structure add karke poora valid run-able C code return karna hai. Agar structure pehle se hai, toh sirf problem wali line ko fix karo baaki sab same rakho.

Tujhe STRICTLY ek valid JSON object return karna hai jisme ye keys honi chahiye: 
"error_type" (jaise SyntaxError, TypeError, MissingStructureError, wgaira), 
"error_line" (sirf number ya "Unknown"), 
"explanation" (Hindi me 2-3 line ka explanation, batao agar basic structure missing thha), 
"how_to_fix" (Hindi me batao ki kaise fix karein), 
"corrected_code" (POORA C code jisme error aur missing structure fix kiya gaya ho). 
JSON format bilkul sahi hona chahiye, koi extra text markdown ke bahar mat likhna.`
    : `You are an expert C programming teacher. The user will provide their C code and complete error message.
READ EXACTLY WHAT THE ERROR SAYS. Explicitly mention the line number where the error occurred. Provide a helpful, clear explanation (2-3 sentences) of why the error happened and what it means.
!! CRITICAL RULE !! The "corrected_code" field MUST contain the COMPLETE corrected program. If the user's code is missing the basic C boilerplate (like '#include <stdio.h>' and 'int main()'), you MUST wrap their logic inside a valid 'int main()' structure in the returned corrected code. If it already has the structure, just fix the errors.

You MUST return a STRICTLY valid JSON object with EXACTLY these keys:
"error_type" (e.g., SyntaxError, TypeError, MissingStructureError, etc.),
"error_line" (just the line number or "Unknown"),
"explanation" (2-3 sentence explanation, mention if they missed the main() structure),
"how_to_fix" (step-by-step fix),
"corrected_code" (the COMPLETE corrected and runnable C code).
Do not include any other text outside the JSON object. Ensure the JSON is properly formatted and escaped.`;

  const userMessage = isHindi
    ? `Code:\n${code}\n\nError:\n${error}\n\nIs error ko completely analyze karo aur mujhe proper JSON me answer do. IMPORTANT: Answer strictly HINDI (Hinglish) me formated properly in valid JSON. No trailing commas!`
    : `Code:\n${code}\n\nError Traceback:\n${error}\n\nAnalyze the Error strictly! Fix ONLY what's broken in the code. Return valid JSON only, with no trailing commas and properly escaped strings.`;

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
      temperature: 0.1,
      response_format: { type: "json_object" }, // Force JSON response if supported
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
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.substring(7);
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.substring(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.substring(0, jsonStr.length - 3);
    jsonStr = jsonStr.trim();
    
    // Find the first { and last }
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No valid JSON object found in response');
    }
    
    jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    
    const parsed = JSON.parse(jsonStr);
    
    return {
      error_type: parsed.error_type || 'Error',
      error_line: parsed.error_line?.toString() || '',
      simple_explanation_english: isHindi ? '' : (parsed.explanation || ''),
      simple_explanation_hindi: isHindi ? (parsed.explanation || '') : '',
      why_error_happened: '',
      how_to_fix: parsed.how_to_fix || '',
      corrected_code: parsed.corrected_code || code,
    };
  } catch (parseErr) {
    console.error('Parse error:', parseErr);
    
    return {
      error_type: 'AI Parse Error',
      error_line: '',
      simple_explanation_english: isHindi ? '' : 'Failed to parse the AI response. Please try again.',
      simple_explanation_hindi: isHindi ? 'AI ke jawab ko samajhne me error aaya. Kripya dubara try karein.' : '',
      why_error_happened: '',
      how_to_fix: 'Click Try Again or Get AI Help button',
      corrected_code: code,
    };
  }
}

export async function generateCCode(prompt: string, language: 'en' | 'hi', client: AIClient = createAIClient()): Promise<string> {
  const isHindi = language === 'hi';
  
  const systemPrompt = isHindi
    ? `Tum ek expert C programmer ho. User ek question poochega aur tumhe sirf aur sirf us point par execute hone wala C code likhna hai. Code me #include statements zaroor include karo. Code ke bahar koi text ya markdown backticks (\`\`\`) mat dena. Sirf plain text code return karo taaki use seedha editor mein run kiya ja sake.`
    : `You are an expert C programmer. The user will ask a programming question or request a script. You must return ONLY raw, executable C code with proper #include statements. Do not include any explanations, markdown formatting (like \`\`\`c), or wrapping text. The response should be ready to run directly in an editor.`;

  const userMessage = `Write C code for this: ${prompt}`;

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

  let cleanedContent = content.trim();
  if (cleanedContent.startsWith('```c')) {
    cleanedContent = cleanedContent.replace(/^```c\s*/i, '');
  } else if (cleanedContent.startsWith('```')) {
    cleanedContent = cleanedContent.replace(/^```\s*/, '');
  }
  
  if (cleanedContent.endsWith('```')) {
    cleanedContent = cleanedContent.replace(/\s*```$/, '');
  }

  return cleanedContent.trim();
}
