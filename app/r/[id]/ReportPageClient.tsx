'use client';

import { useState, useEffect, useCallback, Component, type ReactNode } from 'react';
import type { ReportData, ScriptLine } from '@/types/report';

// ── Error Boundary ──
class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function SectionError({ name }: { name: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center text-zinc-400">
        <p className="text-sm">Sección &quot;{name}&quot; no disponible para este reporte</p>
      </div>
    </div>
  );
}

// ── Lazy imports ──
import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/components/report/HeroSection'), { ssr: false });
const ScorecardSection = dynamic(() => import('@/components/report/ScorecardSection'), { ssr: false });
const VisualAnalysisSection = dynamic(() => import('@/components/report/VisualAnalysisSection'), { ssr: false });
const ContentMetadataSection = dynamic(() => import('@/components/report/ContentMetadataSection'), { ssr: false });
const StrategicAnalysisSection = dynamic(() => import('@/components/report/StrategicAnalysisSection'), { ssr: false });
const VerdictSection = dynamic(() => import('@/components/report/VerdictSection'), { ssr: false });
const ReplicaPlanSection = dynamic(() => import('@/components/report/ReplicaPlanSection'), { ssr: false });
const ProductionGuideSection = dynamic(() => import('@/components/report/ProductionGuideSection'), { ssr: false });
const PublishingStrategySection = dynamic(() => import('@/components/report/PublishingStrategySection'), { ssr: false });
const SuccessMetricsSection = dynamic(() => import('@/components/report/SuccessMetricsSection'), { ssr: false });
const CTABanner = dynamic(() => import('@/components/report/CTABanner'), { ssr: false });
const ReportFooter = dynamic(() => import('@/components/report/ReportFooter'), { ssr: false });
const ScrollNavbar = dynamic(() => import('@/components/report/ScrollNavbar'), { ssr: false });
const TeleprompterModal = dynamic(() => import('@/components/report/TeleprompterModal'), { ssr: false });

// ── Safe defaults ──
function safeScores(s: any) {
  return {
    hook: s?.hook ?? 0,
    copy: s?.copy ?? 0,
    strategy: s?.strategy ?? 0,
    production: s?.production ?? 0,
    virality: s?.virality ?? 0,
    total: s?.total ?? 0,
    replication_difficulty: s?.replication_difficulty ?? 5,
  };
}

function safeMetrics(m: any) {
  return {
    views: m?.views ?? 0,
    likes: m?.likes ?? 0,
    comments: m?.comments ?? 0,
    shares: m?.shares ?? 0,
    engagement_rate: m?.engagement_rate ?? 0,
  };
}

function safeVerdict(v: any) {
  return {
    works: v?.works ?? [],
    improve: v?.improve ?? [],
    opportunity: v?.opportunity ?? { title: 'Sin datos', description: 'Análisis no disponible' },
  };
}

function safeGemini(g: any) {
  return {
    transcription: g?.transcription ?? g?.full_analysis ?? '',
    scenes: g?.scenes ?? [],
    production: g?.production ?? { lighting: '', audio: '', quality: 0, editing: '', cuts_per_minute: 0, aspect_ratio: '9:16' },
    emotional_timeline: g?.emotional_timeline ?? [],
    full_analysis: g?.full_analysis ?? '',
  };
}

function safeStrategic(s: any) {
  const defaultDim = { score: 0, description: 'No disponible', tags: [], recommendation: '' };
  return {
    structure: {
      hook: s?.structure?.hook ?? defaultDim,
      development: s?.structure?.development ?? defaultDim,
      cta: s?.structure?.cta ?? defaultDim,
      format: s?.structure?.format ?? defaultDim,
    },
    copy: {
      formula: { ...defaultDim, detected: '', confidence: 0, ...s?.copy?.formula },
      power_words: { ...defaultDim, words: [], ...s?.copy?.power_words },
      mental_triggers: { ...defaultDim, used: [], missing: [], ...s?.copy?.mental_triggers },
      tone: { ...defaultDim, brain: { reptilian: 33, limbic: 34, neocortex: 33 }, disc: 'I', ...s?.copy?.tone },
    },
    strategy: {
      funnel: { ...defaultDim, stage: 'TOFU' as const, schwartz: 1, ...s?.strategy?.funnel },
      pillar: { ...defaultDim, breakdown: [{ pillar: 'Educar' as const, percentage: 100 }], ...s?.strategy?.pillar },
      sales_angle: { ...defaultDim, pain: '', desire: '', transformation: '', maslow: '', ...s?.strategy?.sales_angle },
      virality: { ...defaultDim, pattern: '', emotion: '', shareability: 'medium', ...s?.strategy?.virality },
    },
    raw_text: s?.raw_text ?? '',
  };
}

function safeProductionGuide(p: any) {
  return {
    checklist: p?.checklist ?? [],
    script_timeline: p?.script_timeline ?? [],
    setup: p?.setup ?? { camera: '', resolution: '', lighting: '', audio: '', background: '', editing: '' },
    music: p?.music ?? { type: '', name: null, trending: false, volume_recommendation: '', source: '' },
  };
}

function safePublishStrategy(p: any) {
  return {
    best_day: p?.best_day ?? '',
    best_time: p?.best_time ?? '',
    timezone: p?.timezone ?? 'America/Bogota',
    reason: p?.reason ?? '',
    post_actions: p?.post_actions ?? [],
    caption_final: p?.caption_final ?? '',
    hashtags_final: p?.hashtags_final ?? [],
    repurposing: p?.repurposing ?? [],
    week_plan: p?.week_plan ?? [],
  };
}

function safeSuccessMetrics(s: any) {
  return {
    kpis: s?.kpis ?? [],
    benchmarks: s?.benchmarks ?? { er_average: 3, good_post: 5, viral_threshold: 8, platform: 'instagram' },
    evaluation_timeline: s?.evaluation_timeline ?? [],
    plan_b: s?.plan_b ?? [],
  };
}

// ── Parse scores from raw_text fallback ──
function parseScoresFromRawText(rawText: string) {
  const defaults = { hook: 0, copy: 0, strategy: 0, production: 0, virality: 0, total: 0, replication_difficulty: 5 };
  if (!rawText) return defaults;

  // Find Hook score: "Hook ... Score: X/10" or "Hook (0-3s): ... Score: X/10"
  const hookMatch = rawText.match(/Hook[^]*?Score:\s*(\d+)\/10/i);
  if (hookMatch) defaults.hook = parseInt(hookMatch[1]);

  // Find CTA/Copy score
  const ctaMatch = rawText.match(/CTA[^]*?Score:\s*(\d+)\/10/i);
  // Find formula/copy score
  const copyMatch = rawText.match(/(?:Fórmula|Copy|Palabras)[^]*?Score:\s*(\d+)\/10/i);
  defaults.copy = parseInt(copyMatch?.[1] || ctaMatch?.[1] || '0');

  // Strategy score
  const strategyMatch = rawText.match(/(?:Embudo|Estrategia|Pilar)[^]*?Score:\s*(\d+)\/10/i);
  if (strategyMatch) defaults.strategy = parseInt(strategyMatch[1]);

  // Production score
  const prodMatch = rawText.match(/Producción para replicar:\s*(\d+)\/10/i);
  if (prodMatch) defaults.production = parseInt(prodMatch[1]);

  // Virality score
  const viralMatch = rawText.match(/Viralidad[^]*?Score:\s*(\d+)\/10/i);
  if (viralMatch) defaults.virality = parseInt(viralMatch[1]);

  // Calculate total as average of non-zero scores
  const scoreValues = [defaults.hook, defaults.copy, defaults.strategy, defaults.production, defaults.virality].filter(s => s > 0);
  if (scoreValues.length > 0) {
    defaults.total = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);
  }

  // Replication difficulty
  if (prodMatch) defaults.replication_difficulty = parseInt(prodMatch[1]);

  return defaults;
}

// ── Estimate views when missing ──
function estimateViews(metrics: any, niche?: string): number | null {
  const likes = metrics?.likes || 0;
  const comments = metrics?.comments || 0;
  if (likes === 0) return null;

  const benchmarks: Record<string, number> = {
    fitness: 5, food: 4.2, fashion: 3.8, finance: 2.5,
    education: 4, business: 3.2, beauty: 5, travel: 4.5,
    motivation: 4, tech: 3, health: 4, general: 3,
  };
  const er = benchmarks[(niche || 'general').toLowerCase()] || 3;
  return Math.round((likes + comments) / (er / 100));
}

// ── Component ──
export default function ReportPageClient({ data }: { data: ReportData }) {
  const [activeSection, setActiveSection] = useState('resumen');
  const [teleprompterOpen, setTeleprompterOpen] = useState(false);
  const [teleprompterScript, setTeleprompterScript] = useState<ScriptLine[]>([]);
  const [teleprompterVersion, setTeleprompterVersion] = useState('');

  const handleOpenTeleprompter = useCallback((version: string, script: ScriptLine[]) => {
    let finalScript = script;

    // Fallback: if script array is empty, parse teleprompter_script raw text
    if ((!finalScript || finalScript.length === 0) && data.teleprompter_script) {
      finalScript = data.teleprompter_script
        .split(/\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => ({
          time: "",
          text: line,
          direction: "",
          section: "development" as const,
        }));
    }

    setTeleprompterScript(finalScript);
    setTeleprompterVersion(version);
    setTeleprompterOpen(true);
  }, [data.teleprompter_script]);

  // Intersection observer for active section
  useEffect(() => {
    const sections = ['resumen', 'scorecard', 'visual', 'strategic', 'verdict', 'replica', 'production', 'publishing', 'metrics'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-52px 0px -40% 0px', threshold: 0.1 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scores = safeScores(data.scores);
  const rawMetrics = safeMetrics(data.metrics);
  const verdict = safeVerdict(data.verdict);
  const gemini = safeGemini(data.gemini_analysis);
  const strategic = safeStrategic(data.strategic_analysis);
  const productionGuide = safeProductionGuide(data.production_guide);
  const publishStrategy = safePublishStrategy(data.publish_strategy);
  const successMetrics = safeSuccessMetrics(data.success_metrics);

  // Estimate views when missing
  const viewsEstimated = !rawMetrics.views;
  const estimatedViewsValue = viewsEstimated ? estimateViews(rawMetrics, data.niche) : null;
  const metrics = {
    ...rawMetrics,
    views: rawMetrics.views || estimatedViewsValue || 0,
  };

  // Calculate engagement rate from estimated views if needed
  const effectiveER = (() => {
    if (data.engagement_rate && data.engagement_rate > 0) return data.engagement_rate;
    if (rawMetrics.engagement_rate && rawMetrics.engagement_rate > 0) return rawMetrics.engagement_rate;
    if (metrics.views > 0 && (metrics.likes || metrics.comments)) {
      return +((((metrics.likes || 0) + (metrics.comments || 0)) / metrics.views) * 100).toFixed(2);
    }
    return 0;
  })();

  // If all scores are 0, try parsing from raw text
  const effectiveScores = (() => {
    if (scores.total === 0 && data.strategic_analysis?.raw_text) {
      const parsed = parseScoresFromRawText(data.strategic_analysis.raw_text);
      if (parsed.total > 0) {
        return { ...scores, ...parsed };
      }
    }
    return scores;
  })();

  return (
    <>
      <ScrollNavbar activeSection={activeSection} />

      <div className="bg-mesh-gradient min-h-screen">
        <div id="resumen">
          <ErrorBoundary fallback={<SectionError name="Hero" />}>
            <HeroSection data={data} effectiveScores={effectiveScores} viewsEstimated={viewsEstimated && !!estimatedViewsValue} estimatedViews={estimatedViewsValue} effectiveER={effectiveER} />
          </ErrorBoundary>
        </div>

        <div className="divider-glow max-w-4xl mx-auto my-2" />

        <div id="analysis-sections">
          <ErrorBoundary fallback={<SectionError name="Scorecard" />}>
            <ScorecardSection
              scores={effectiveScores}
              metrics={metrics}
              verdict={verdict}
              engagementRate={effectiveER}
              niche={data.niche}
              nicheBenchmark={data.niche_benchmark}
              sentiment={data.sentiment}
              contentTags={data.content_tags}
              viewsEstimated={viewsEstimated && !!estimatedViewsValue}
            />
          </ErrorBoundary>
        </div>

        <div className="divider-glow max-w-4xl mx-auto my-2" />

        {/* Content Metadata */}
        <ErrorBoundary fallback={<SectionError name="Metadata" />}>
          <ContentMetadataSection
            caption={data.caption}
            hashtags={data.hashtags}
            mentions={data.mentions}
            topComments={data.top_comments}
            soundUsed={data.sound_used}
            publishedAt={data.published_at}
            originalUrl={data.original_url}
          />
        </ErrorBoundary>

        <div className="divider-glow max-w-4xl mx-auto my-2" />

        {gemini.full_analysis && (
          <ErrorBoundary fallback={<SectionError name="Análisis Visual" />}>
            <VisualAnalysisSection
              gemini={gemini}
              geminiProductionSpecs={data.gemini_production_specs}
              geminiEmotions={data.gemini_emotions}
              aspectRatio={data.aspect_ratio}
              videoQuality={data.video_quality}
            />
          </ErrorBoundary>
        )}

        {gemini.full_analysis && strategic.raw_text && (
          <div className="divider-glow max-w-4xl mx-auto my-2" />
        )}

        {strategic.raw_text && (
          <ErrorBoundary fallback={<SectionError name="12 Dimensiones" />}>
            <StrategicAnalysisSection analysis={strategic} scores={effectiveScores} />
          </ErrorBoundary>
        )}

        <div className="divider-glow max-w-4xl mx-auto my-2" />

        <ErrorBoundary fallback={<SectionError name="Veredicto" />}>
          <VerdictSection verdict={verdict} metrics={metrics} rawAnalysis={strategic.raw_text} />
        </ErrorBoundary>

        <div className="divider-glow max-w-4xl mx-auto my-2" />

        {data.replicas && (
          <ErrorBoundary fallback={<SectionError name="Plan de Réplica" />}>
            <ReplicaPlanSection
              replicas={data.replicas}
              wizard={data.wizard_config}
              onOpenTeleprompter={handleOpenTeleprompter}
              teleprompterScript={data.teleprompter_script}
            />
          </ErrorBoundary>
        )}

        {productionGuide.script_timeline.length > 0 && (
          <ErrorBoundary fallback={<SectionError name="Guía de Producción" />}>
            <ProductionGuideSection guide={productionGuide} />
          </ErrorBoundary>
        )}

        {publishStrategy.best_day && (
          <ErrorBoundary fallback={<SectionError name="Publicación" />}>
            <PublishingStrategySection strategy={publishStrategy} />
          </ErrorBoundary>
        )}

        {successMetrics.kpis.length > 0 && (
          <ErrorBoundary fallback={<SectionError name="Métricas" />}>
            <SuccessMetricsSection metrics={successMetrics} />
          </ErrorBoundary>
        )}

        <ErrorBoundary fallback={null}>
          <CTABanner />
        </ErrorBoundary>

        <ErrorBoundary fallback={null}>
          <ReportFooter
            reportId={data.id}
            generatedDate={new Date(data.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
          />
        </ErrorBoundary>
      </div>

      {teleprompterOpen && (
        <ErrorBoundary fallback={null}>
          <TeleprompterModal
            isOpen={teleprompterOpen}
            onClose={() => setTeleprompterOpen(false)}
            script={teleprompterScript}
            versionLabel={teleprompterVersion}
          />
        </ErrorBoundary>
      )}
    </>
  );
}
