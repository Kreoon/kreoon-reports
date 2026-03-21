import { NextRequest, NextResponse } from 'next/server';
import { getReport, updateReport } from '@/lib/reportApi';
import type { ContentWizardInput, ContentReplica, ScriptLine } from '@/types/report';

interface Params {
  params: Promise<{ id: string }>;
}

const SYSTEM_PROMPT = `Eres un estratega de contenido senior en Kreoon, agencia de UGC y contenido en Colombia.

Tu tarea es generar guiones de contenido listos para grabar basándote en:
1. El diagnóstico de marca del cliente (scores, industria, oportunidades)
2. El tema/producto específico que quiere promover
3. La plataforma y objetivo elegidos

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
    "caption": "Caption completo para la publicación con emojis y saltos de línea",
    "hashtags": ["hashtag1", "hashtag2", "...max 15"],
    "production_notes": "Notas de producción: iluminación, audio, encuadre, edición",
    "best_time": "Mejor día y hora para publicar (ej: Martes 7:00 PM COT)",
    "repurposing": ["Idea de repurposing 1", "Idea 2"]
  }
]

REGLAS:
- Cada guión debe durar 15-60 segundos según la plataforma
- TikTok: 15-30s, directo, trends. Instagram Reels: 20-45s, estético. YouTube Shorts: 30-60s, más informativo
- Hook SIEMPRE en los primeros 3 segundos — usa curiosidad, controversia o beneficio directo
- El CTA debe ser natural, no forzado
- Los hashtags deben mezclar volumen alto + nicho específico
- Si el tono es "educativo", usa estructura problema→solución. Si es "entretenido", usa storytelling o humor. Si es "inspiracional", usa transformación. Si es "directo", ve al grano con beneficios
- Cada variación debe tener un ángulo DIFERENTE (no repetir el mismo hook con otras palabras)
- Adapta el lenguaje a LATAM (español neutro, no España)
- NO inventes métricas ni datos`;

export async function POST(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { id } = await params;

  // Validate Gemini key exists
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return NextResponse.json({ error: 'LLM not configured' }, { status: 500 });
  }

  // Get existing report
  const report = await getReport(id);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // Parse wizard input
  let input: ContentWizardInput;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!input.topic || !input.cta || !input.objective || !input.platform || !input.tone || !input.variations) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 });
  }

  // Build context depending on report type
  let contextBlock: string;

  if (report.brand_diagnosis) {
    const bd = report.brand_diagnosis;
    contextBlock = `MARCA: ${bd.brand_name}
INDUSTRIA: ${bd.brand_industry}
SCORE GENERAL: ${bd.overall_score}/100
SCORES: Contenido ${bd.scores.content_quality}, Estrategia ${bd.scores.strategy}, Engagement ${bd.scores.engagement}, Branding ${bd.scores.branding}
OPORTUNIDADES TOP: ${bd.opportunities.slice(0, 3).map((o: any) => o.title).join(', ')}
REDES: ${bd.social_profiles.map((p: any) => `${p.platform} @${p.username} (${p.followers || '?'} seg)`).join(', ')}
HOOK PATTERNS DETECTADOS: ${bd.hook_patterns.join(', ')}`;
  } else {
    // Content-analysis report context
    const scores = report.scores || {};
    const strategic = report.strategic_analysis?.raw_text || '';
    const verdict = report.verdict || {};
    contextBlock = `CREADOR: @${report.creator_username || 'desconocido'}
PLATAFORMA ORIGINAL: ${report.platform}
TIPO DE CONTENIDO: ${report.content_type}
SCORES: Hook ${scores.hook || 0}/10, Copy ${scores.copy || 0}/10, Estrategia ${scores.strategy || 0}/10, Producción ${scores.production || 0}/10, Viralidad ${scores.virality || 0}/10
CAPTION ORIGINAL: ${(report.caption || '').slice(0, 300)}
LO QUE FUNCIONA: ${Array.isArray(verdict.works) ? verdict.works.join(', ') : ''}
LO QUE MEJORAR: ${Array.isArray(verdict.improve) ? verdict.improve.join(', ') : ''}
ANÁLISIS ESTRATÉGICO: ${strategic.slice(0, 500)}`;
  }

  const userMessage = `${contextBlock}

═══ PEDIDO DEL CLIENTE ═══
TEMA/PRODUCTO: ${input.topic}
CTA DESEADO: ${input.cta}
OBJETIVO: ${input.objective}
PLATAFORMA: ${input.platform}
TONO: ${input.tone}
VARIACIONES: ${input.variations}

Genera exactamente ${input.variations} variación(es) de contenido. Cada una con un ángulo diferente.`;

  try {
    // Call Gemini
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + userMessage }] },
          ],
          generationConfig: {
            maxOutputTokens: 4000,
            temperature: 0.7,
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('[Gemini Error]', errText);
      return NextResponse.json({ error: 'LLM request failed' }, { status: 502 });
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON from response
    let jsonText = rawText.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const replicas: ContentReplica[] = JSON.parse(jsonText);

    // Save to report (different field depending on report type)
    if (report.brand_diagnosis) {
      await updateReport(id, {
        brand_diagnosis: {
          ...report.brand_diagnosis,
          content_replicas: replicas,
        },
      } as any);
    } else {
      await updateReport(id, {
        wizard_config: { topic: input.topic, objective: input.objective, platform: input.platform },
        replicas: {
          faithful: { hook: replicas[0]?.hook || '', script: replicas[0]?.script || [], caption: replicas[0]?.caption || '', hashtags: replicas[0]?.hashtags?.join(' ') || '', production_notes: replicas[0]?.production_notes || '' },
          improved: { hook: replicas[1]?.hook || replicas[0]?.hook || '', script: replicas[1]?.script || replicas[0]?.script || [], caption: replicas[1]?.caption || replicas[0]?.caption || '', hashtags: replicas[1]?.hashtags?.join(' ') || '', production_notes: replicas[1]?.production_notes || '', improvements: [], triggers_added: [], neurocopy_changes: [] },
          kreoon: { hook: replicas[2]?.hook || replicas[0]?.hook || '', script: replicas[2]?.script || replicas[0]?.script || [], caption: replicas[2]?.caption || replicas[0]?.caption || '', hashtags: replicas[2]?.hashtags?.join(' ') || '', production_notes: replicas[2]?.production_notes || '', storybrand: { hero: '', guide: '', plan: '', cta: input.cta, success: '', failure: '' }, creator_brief: { brand: input.topic, product: input.topic, objective: input.objective, platform: input.platform, duration: '30s', key_messages: [], dos: [], donts: [], deliverables: [] } },
        },
      } as any);
    }

    return NextResponse.json({ replicas }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Generate Content Error]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
