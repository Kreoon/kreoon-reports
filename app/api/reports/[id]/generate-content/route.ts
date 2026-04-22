import { NextRequest, NextResponse } from 'next/server';
import { getReport, updateReport } from '@/lib/reportApi';
import { callLLM, extractJSON } from '@/lib/llm';
import { buildAlexPrompt, PILARES } from '@/lib/voice-profile';
import type { ContentWizardInput, ContentReplica, ReplicaMode } from '@/types/report';

// Vercel: aumentar timeout para fallback chain (default 10s, max 60s en free/hobby)
export const maxDuration = 60;

interface Params {
  params: Promise<{ id: string }>;
}

// ─── System prompts por modo ────────────────────────────────────────────────

function buildSystemPrompt(mode: ReplicaMode, variations: number, platform: string, alexPilar?: string): string {
  const base = `Eres un estratega de contenido senior en Kreoon (agencia UGC Colombia).

Tu tarea: generar EXACTAMENTE ${variations} variación(es) de guión listo para grabar, basándote en el análisis completo del video de referencia que viene en el bloque CONTEXTO.

Cada variación debe tener un ángulo DIFERENTE (no repetir el mismo hook con otras palabras).

═══ FORMATO DE RESPUESTA ═══
Responde EXCLUSIVAMENTE en JSON válido (sin markdown, sin backticks) con esta estructura:

[
  {
    "version": 1,
    "title": "Título corto del contenido",
    "hook": "Hook de los primeros 3 segundos — debe detener el scroll",
    "script": [
      {"time": "0-3s", "text": "Lo que se dice", "direction": "Acción visual", "on_screen_text": "Texto en pantalla (opcional)", "section": "hook"},
      {"time": "3-8s", "text": "...", "direction": "...", "section": "development"},
      {"time": "...", "text": "...", "direction": "...", "section": "cta"}
    ],
    "caption": "Caption completo con emojis y saltos de línea",
    "hashtags": ["hashtag1", "hashtag2"],
    "production_notes": "Iluminación, audio, encuadre, edición",
    "best_time": "Mejor día y hora (ej: Martes 7 PM COT)",
    "repurposing": ["Idea de repurposing 1", "Idea 2"]
  }
]

═══ REGLAS GENERALES ═══
- Duración según plataforma. TikTok 15-30s / Reels 20-45s / Shorts 30-60s.
- Hook en primeros 3s usando curiosidad, controversia o beneficio directo.
- Español LATAM (no España).
- CTA natural, no forzado.
- Hashtags mix: 30% grandes + 40% medianos + 30% nicho.
- USA el análisis del video de referencia (escenas, emociones, hook detectado, estructura) para fundamentar cada decisión.
- No inventes métricas ni claims falsos.`;

  switch (mode) {
    case 'brand':
      return base + `

═══ MODO: OTRA MARCA ═══
Mantén la MISMA ESTRUCTURA que funcionó en el original (hook pattern, ritmo, tipo de CTA) pero adapta todo a la marca/persona nueva. Conserva lo que hizo viral al video de referencia.
Respeta si la marca es personal (lenguaje en primera persona, historia) vs comercial (claim del producto, beneficios concretos).`;

    case 'niche':
      return base + `

═══ MODO: OTRO NICHO ═══
Mantén el FORMATO y los GATILLOS del video original (fórmula copy, pillar de contenido, emoción dominante) pero traslada TODO a un nicho totalmente distinto.
Ajusta jerga, ejemplos, referencias culturales y audiencia. El "esqueleto" es el mismo, el "cuerpo" es nuevo.`;

    case 'angle':
      return base + `

═══ MODO: OTRO ÁNGULO (REMIX) ═══
Mantén tema y marca del original pero CAMBIA el ángulo. Rompe la expectativa desde el segundo 0.
- Si el original es motivacional → sé escéptico/realista.
- Si es educativo → sé provocador/contrarian.
- Si es aspiracional → sé crudo/honesto.
- Si es técnico → sé emocional.
Aprovecha los "gatillos faltantes" que detectó el análisis estratégico.`;

    case 'alex':
      return base + `

═══ MODO: VOZ ALEXANDER CAST — PILAR ÚNICO ═══
Adapta el guión a la voz de Alexander Cast usando EXCLUSIVAMENTE el pilar elegido.
NO mezcles contenido de pilares (si el pilar es Dios, no hables de IA).

${buildAlexPrompt(alexPilar as any)}

Instrucciones:
- Usa SOLO los temas, vocabulario y patrones de hook del pilar activo.
- Mantén la estructura del video original pero reescribe al pilar.
- Respeta las prohibiciones del pilar (NO HACER).`;
  }
}

// ─── Builder del contextBlock (análisis completo del video original) ────────

function buildContextBlock(report: any): string {
  // Brand diagnosis context (legacy path)
  if (report.brand_diagnosis) {
    const bd = report.brand_diagnosis;
    return `═══ DIAGNÓSTICO DE MARCA ═══
MARCA: ${bd.brand_name}
INDUSTRIA: ${bd.brand_industry}
SCORE GENERAL: ${bd.overall_score}/100
SCORES: Contenido ${bd.scores?.content_quality}, Estrategia ${bd.scores?.strategy}, Engagement ${bd.scores?.engagement}, Branding ${bd.scores?.branding}
OPORTUNIDADES TOP: ${(bd.opportunities || []).slice(0, 3).map((o: any) => o.title).join(', ')}
REDES: ${(bd.social_profiles || []).map((p: any) => `${p.platform} @${p.username}`).join(', ')}
HOOK PATTERNS DETECTADOS: ${(bd.hook_patterns || []).join(', ')}`;
  }

  // Content-analysis (Jarvis reel) context — usa TODO el análisis disponible
  const geminiFull = report.gemini_analysis?.full_analysis || report.gemini_transcription || '';
  const strategicFull = report.strategic_analysis?.raw_text || '';
  const scores = report.scores || {};
  const verdict = report.verdict || {};
  const worksArr = Array.isArray(verdict.works) ? verdict.works : [];
  const improveArr = Array.isArray(verdict.improve) ? verdict.improve : [];

  return `═══ VIDEO DE REFERENCIA ═══
CREADOR: @${report.creator_username || 'desconocido'}${report.creator_verified ? ' ✓' : ''}
PLATAFORMA: ${report.platform} · TIPO: ${report.content_type} · DURACIÓN: ${report.duration_seconds || '?'}s
MÉTRICAS: ${report.metrics?.views || '?'} views · ${report.metrics?.likes || '?'} likes · ${report.metrics?.comments || '?'} comments
CAPTION ORIGINAL: ${(report.caption || '').slice(0, 500)}
HASHTAGS: ${(report.hashtags || []).slice(0, 15).join(', ')}

═══ SCORES DEL ORIGINAL ═══
Hook ${scores.hook || 0}/10 · Copy ${scores.copy || 0}/10 · Estrategia ${scores.strategy || 0}/10 · Producción ${scores.production || 0}/10 · Viralidad ${scores.virality || 0}/10

═══ ANÁLISIS VISUAL DE GEMINI (10 dimensiones) ═══
${geminiFull}

═══ ANÁLISIS ESTRATÉGICO (12 dimensiones) ═══
${strategicFull}

═══ VEREDICTO ═══
LO QUE FUNCIONA: ${typeof worksArr[0] === 'string' ? worksArr.join(' · ') : worksArr.map((w: any) => w.title || w.description || '').join(' · ')}
LO QUE SE PUEDE MEJORAR: ${typeof improveArr[0] === 'string' ? improveArr.join(' · ') : improveArr.map((w: any) => w.title || w.description || '').join(' · ')}`;
}

// ─── Builder del userMessage según modo ─────────────────────────────────────

function buildUserMessage(input: ContentWizardInput, contextBlock: string): string {
  const mode = input.mode || 'brand';
  const platformLabel = { instagram: 'Instagram Reels', tiktok: 'TikTok', youtube: 'YouTube Shorts' }[input.platform];

  let brief = '';
  switch (mode) {
    case 'brand':
      brief = `TIPO DE MARCA: ${input.brand_type === 'personal' ? 'Marca personal (primera persona)' : 'Marca comercial'}
MARCA/PERSONA: ${input.brand_name || 'sin especificar'}
PRODUCTO/SERVICIO: ${input.product || input.topic || 'sin especificar'}`;
      break;
    case 'niche':
      brief = `NUEVO NICHO: ${input.new_niche || input.topic || 'sin especificar'}
AUDIENCIA OBJETIVO: ${input.target_audience || 'sin especificar'}`;
      break;
    case 'angle':
      brief = `ÁNGULO DESEADO: ${input.new_angle || 'contrarian'}
TEMA (puede ser el mismo del original): ${input.topic || 'mantén el del original'}`;
      break;
    case 'alex':
      brief = `TEMA: ${input.topic || 'derivar del análisis del video'}
(Usar voz Alexander Cast — ver system prompt para perfil)`;
      break;
  }

  return `${contextBlock}

═══ PEDIDO DEL CLIENTE ═══
${brief}
CTA DESEADO: ${input.cta}
OBJETIVO: ${input.objective}
PLATAFORMA DESTINO: ${platformLabel}
TONO: ${input.tone}
VARIACIONES: ${input.variations}

Genera EXACTAMENTE ${input.variations} variación(es) en JSON.`;
}

// ─── Handler POST ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { id } = await params;

  const report = await getReport(id);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  let input: ContentWizardInput;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Validate required common fields
  if (!input.cta || !input.objective || !input.platform || !input.tone || !input.variations) {
    return NextResponse.json({ error: 'Missing required fields: cta, objective, platform, tone, variations' }, { status: 422 });
  }

  // Default mode + validate per-mode fields
  const mode: ReplicaMode = input.mode || 'brand';
  if (mode === 'brand' && !input.brand_name && !input.topic) {
    return NextResponse.json({ error: 'Mode brand requires brand_name' }, { status: 422 });
  }
  if (mode === 'niche' && !input.new_niche && !input.topic) {
    return NextResponse.json({ error: 'Mode niche requires new_niche' }, { status: 422 });
  }

  // Si modo es alex, validar que venga el pilar
  if (mode === 'alex' && !input.alex_pilar) {
    return NextResponse.json({
      error: 'Mode alex requires alex_pilar: dios|estrategia|ia|proceso|vida',
      available_pilares: Object.values(PILARES).map(p => ({ id: p.id, label: p.label, short: p.short })),
    }, { status: 422 });
  }

  const contextBlock = buildContextBlock(report);
  const systemPrompt = buildSystemPrompt(mode, input.variations, input.platform, input.alex_pilar);
  const userMessage = buildUserMessage({ ...input, mode }, contextBlock);

  try {
    const { text, provider } = await callLLM({
      systemPrompt,
      userMessage,
      responseFormat: 'json',
      maxTokens: 8000,
      temperature: 0.7,
    });

    let replicas: ContentReplica[];
    try {
      const parsed = extractJSON<ContentReplica[] | { replicas: ContentReplica[] }>(text);
      replicas = Array.isArray(parsed) ? parsed : (parsed as any).replicas || [];
    } catch (e: any) {
      console.error('[generate-content] JSON parse failed, raw text:', text.slice(0, 500));
      return NextResponse.json({ error: `LLM returned invalid JSON (${provider}): ${e.message}` }, { status: 502 });
    }

    if (!Array.isArray(replicas) || replicas.length === 0) {
      return NextResponse.json({ error: `LLM returned empty replicas (${provider})` }, { status: 502 });
    }

    // Persist to report
    if (report.brand_diagnosis) {
      await updateReport(id, {
        brand_diagnosis: { ...report.brand_diagnosis, content_replicas: replicas },
      } as any);
    } else {
      const topic = input.brand_name || input.new_niche || input.topic || '';
      await updateReport(id, {
        wizard_config: { topic, objective: input.objective, platform: input.platform },
        replicas: {
          faithful: { hook: replicas[0]?.hook || '', script: replicas[0]?.script || [], caption: replicas[0]?.caption || '', hashtags: replicas[0]?.hashtags?.join(' ') || '', production_notes: replicas[0]?.production_notes || '' },
          improved: { hook: replicas[1]?.hook || replicas[0]?.hook || '', script: replicas[1]?.script || replicas[0]?.script || [], caption: replicas[1]?.caption || replicas[0]?.caption || '', hashtags: replicas[1]?.hashtags?.join(' ') || '', production_notes: replicas[1]?.production_notes || '', improvements: [], triggers_added: [], neurocopy_changes: [] },
          kreoon: { hook: replicas[2]?.hook || replicas[0]?.hook || '', script: replicas[2]?.script || replicas[0]?.script || [], caption: replicas[2]?.caption || replicas[0]?.caption || '', hashtags: replicas[2]?.hashtags?.join(' ') || '', production_notes: replicas[2]?.production_notes || '', storybrand: { hero: '', guide: '', plan: '', cta: input.cta, success: '', failure: '' }, creator_brief: { brand: topic, product: input.product || topic, objective: input.objective, platform: input.platform, duration: '30s', key_messages: [], dos: [], donts: [], deliverables: [] } },
        },
      } as any);
    }

    return NextResponse.json({ replicas, provider, mode }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[generate-content] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
