/**
 * LLM fallback chain para kreoon-reports (Vercel serverless).
 * Orden: groq → openrouter → gemini → claude.
 *
 * Diseño:
 * - Cada provider es una función async que recibe opts comunes y retorna string.
 * - Si provider falla (rate limit, JSON inválido, timeout), pasa al siguiente.
 * - Usa fetch nativo (no SDK) para evitar agregar deps pesadas.
 */

export type LLMProvider = 'groq' | 'openrouter' | 'gemini' | 'claude';

export interface CallLLMOptions {
  systemPrompt: string;
  userMessage: string;
  responseFormat?: 'json' | 'text';
  maxTokens?: number;
  temperature?: number;
  /** Max chars del systemPrompt+userMessage. Si excede, se trunca userMessage desde el inicio. */
  maxContextChars?: number;
}

export interface CallLLMResult {
  text: string;
  provider: LLMProvider;
}

const FALLBACK_CHAIN: LLMProvider[] = ['groq', 'openrouter', 'gemini', 'claude'];

// Context limits por provider (chars approx). OpenRouter free llama es el más chico.
const CONTEXT_LIMITS: Record<LLMProvider, number> = {
  groq: 120_000,
  openrouter: 16_000,   // free tier de llama es pequeño
  gemini: 500_000,
  claude: 150_000,
};

const TIMEOUT_MS = 60_000;

function truncateForProvider(opts: CallLLMOptions, provider: LLMProvider): CallLLMOptions {
  const limit = opts.maxContextChars ?? CONTEXT_LIMITS[provider];
  const total = opts.systemPrompt.length + opts.userMessage.length;
  if (total <= limit) return opts;
  const allowed = Math.max(1000, limit - opts.systemPrompt.length - 500);
  return {
    ...opts,
    userMessage: opts.userMessage.slice(0, allowed) + '\n\n[... contexto truncado ...]',
  };
}

export async function callLLM(opts: CallLLMOptions): Promise<CallLLMResult> {
  const errors: Record<string, string> = {};
  for (const provider of FALLBACK_CHAIN) {
    if (!hasKey(provider)) {
      errors[provider] = 'no api key';
      continue;
    }
    try {
      const adjusted = truncateForProvider(opts, provider);
      const text = await callProvider(provider, adjusted);
      if (!text || text.trim().length === 0) {
        throw new Error('empty response');
      }
      console.log(`[llm] ${provider} ok (${text.length} chars)`);
      return { text, provider };
    } catch (err: any) {
      const msg = err?.message?.slice(0, 200) || String(err).slice(0, 200);
      errors[provider] = msg;
      console.warn(`[llm] ${provider} failed: ${msg}`);
    }
  }
  throw new Error(`All LLM providers failed: ${JSON.stringify(errors)}`);
}

function hasKey(provider: LLMProvider): boolean {
  switch (provider) {
    case 'groq': return !!process.env.GROQ_API_KEY;
    case 'openrouter': return !!process.env.OPENROUTER_API_KEY;
    case 'gemini': return !!process.env.GEMINI_API_KEY;
    case 'claude': return !!process.env.ANTHROPIC_API_KEY;
  }
}

async function callProvider(provider: LLMProvider, opts: CallLLMOptions): Promise<string> {
  switch (provider) {
    case 'groq': return callOpenAICompat(opts, 'https://api.groq.com/openai/v1/chat/completions', process.env.GROQ_API_KEY!, 'llama-3.3-70b-versatile', 'groq');
    case 'openrouter': return callOpenAICompat(opts, 'https://openrouter.ai/api/v1/chat/completions', process.env.OPENROUTER_API_KEY!, 'meta-llama/llama-3.3-70b-instruct:free', 'openrouter');
    case 'gemini': return callGemini(opts);
    case 'claude': return callClaude(opts);
  }
}

// ─── OpenAI-compatible (Groq, OpenRouter) ───────────────────────────────────

async function callOpenAICompat(
  opts: CallLLMOptions,
  url: string,
  apiKey: string,
  model: string,
  providerName: LLMProvider,
): Promise<string> {
  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: 'system', content: opts.systemPrompt },
      { role: 'user', content: opts.userMessage },
    ],
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.7,
  };
  if (opts.responseFormat === 'json') {
    body.response_format = { type: 'json_object' };
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };
  if (providerName === 'openrouter') {
    headers['HTTP-Referer'] = 'https://kreoon-reports.vercel.app';
    headers['X-Title'] = 'Kreoon Reports';
  }
  const res = await fetchWithTimeout(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`${providerName} ${res.status}: ${t.slice(0, 200)}`);
  }
  const data: any = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// ─── Gemini ─────────────────────────────────────────────────────────────────

async function callGemini(opts: CallLLMOptions): Promise<string> {
  const key = process.env.GEMINI_API_KEY!;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
  const body: Record<string, unknown> = {
    contents: [
      { role: 'user', parts: [{ text: `${opts.systemPrompt}\n\n${opts.userMessage}` }] },
    ],
    generationConfig: {
      maxOutputTokens: opts.maxTokens ?? 8000,
      temperature: opts.temperature ?? 0.7,
      ...(opts.responseFormat === 'json' ? { responseMimeType: 'application/json' } : {}),
    },
  };
  const res = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`gemini ${res.status}: ${t.slice(0, 200)}`);
  }
  const data: any = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// ─── Claude ─────────────────────────────────────────────────────────────────

async function callClaude(opts: CallLLMOptions): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY!;
  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.7,
    system: opts.systemPrompt,
    messages: [{ role: 'user' as const, content: opts.userMessage }],
  };
  const res = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`claude ${res.status}: ${t.slice(0, 200)}`);
  }
  const data: any = await res.json();
  const block = data.content?.find((b: any) => b.type === 'text');
  return block?.text ?? '';
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Extrae el primer JSON (array u objeto) del texto.
 * Tolera respuestas envueltas en ```json, texto antes/después, etc.
 */
export function extractJSON<T = unknown>(text: string): T {
  let clean = text.trim();
  // Strip markdown fences
  clean = clean.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '');
  // Try direct parse first
  try {
    return JSON.parse(clean) as T;
  } catch { /* fallthrough */ }
  // Extract first [...] or {...} block
  const arrMatch = clean.match(/\[[\s\S]*\]/);
  const objMatch = clean.match(/\{[\s\S]*\}/);
  const candidate = arrMatch?.[0] ?? objMatch?.[0];
  if (!candidate) {
    throw new Error(`No JSON found in text (first 200 chars): ${clean.slice(0, 200)}`);
  }
  return JSON.parse(candidate) as T;
}
