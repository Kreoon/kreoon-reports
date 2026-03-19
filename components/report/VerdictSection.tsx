"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type { Verdict, Metrics } from "@/types/report";

interface VerdictSectionProps {
  verdict: Verdict;
  metrics: Metrics;
  rawAnalysis?: string;
}

// ── Parse verdict from raw analysis text ─────────────────────────────────────

function parseVerdictFromRaw(raw: string): { works: Verdict["works"]; improve: Verdict["improve"]; opportunity: Verdict["opportunity"] } | null {
  const works: Verdict["works"] = [];
  const improve: Verdict["improve"] = [];
  let opportunity: Verdict["opportunity"] = { title: "Sin datos", description: "Análisis no disponible" };

  // Extract "Funciona" items
  const funcionaMatch = raw.match(/✅\s*Funciona[:\s]*\n([\s\S]*?)(?=❌|💡|$)/);
  if (funcionaMatch) {
    const lines = funcionaMatch[1].split("\n").filter((l) => l.trim());
    for (const line of lines) {
      const cleaned = line.replace(/^\s*\d+[\.\)]\s*/, "").trim();
      if (cleaned) {
        // Split on first period or dash to get title/description
        const dotIdx = cleaned.indexOf(". ");
        if (dotIdx > 0 && dotIdx < 80) {
          works.push({ title: cleaned.slice(0, dotIdx), description: cleaned.slice(dotIdx + 2) });
        } else {
          works.push({ title: cleaned, description: "" });
        }
      }
    }
  }

  // Extract "Mejorar" items
  const mejorarMatch = raw.match(/❌\s*Mejorar[:\s]*\n([\s\S]*?)(?=💡|✅|$)/);
  if (mejorarMatch) {
    const lines = mejorarMatch[1].split("\n").filter((l) => l.trim());
    for (const line of lines) {
      const cleaned = line.replace(/^\s*\d+[\.\)]\s*/, "").trim();
      if (cleaned) {
        const dotIdx = cleaned.indexOf(". ");
        if (dotIdx > 0 && dotIdx < 80) {
          improve.push({ title: cleaned.slice(0, dotIdx), description: cleaned.slice(dotIdx + 2) });
        } else {
          improve.push({ title: cleaned, description: "" });
        }
      }
    }
  }

  // Extract opportunity
  const opMatch = raw.match(/💡\s*Oportunidad[^:]*:\s*(.*)/);
  if (opMatch) {
    opportunity = { title: "Oportunidad oculta", description: opMatch[1].trim() };
  }

  if (works.length === 0 && improve.length === 0) return null;
  return { works, improve, opportunity };
}

// ── ER benchmark helpers ──────────────────────────────────────────────────────

const NICHE_BENCHMARKS: Record<string, number> = {
  general: 3.0,
  fitness: 5.5,
  food: 4.2,
  fashion: 3.8,
  finance: 2.5,
  education: 4.0,
  entertainment: 6.0,
  beauty: 5.0,
  travel: 4.5,
  business: 3.2,
};

function getNicheBenchmark(): number {
  // Default general benchmark; can be extended to accept niche prop
  return NICHE_BENCHMARKS.general;
}

function erRating(er: number, benchmark: number): { label: string; color: string; bg: string } {
  const ratio = er / benchmark;
  if (ratio >= 1.5) return { label: "EXCELENTE", color: "text-green-400", bg: "bg-green-500/20" };
  if (ratio >= 1.0) return { label: "BUENO",     color: "text-blue-400",  bg: "bg-blue-500/20"  };
  if (ratio >= 0.6) return { label: "REGULAR",   color: "text-yellow-400",bg: "bg-yellow-500/20"};
  return             { label: "BAJO",            color: "text-red-400",   bg: "bg-red-500/20"   };
}

// ── Animation variants ────────────────────────────────────────────────────────

const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

// ── Sub-components ────────────────────────────────────────────────────────────

function WorksCard({ verdict }: { verdict: Verdict }) {
  return (
    <motion.div
      custom={0}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex-1 min-w-0 bg-green-500/10 border-l-4 border-green-500 rounded-xl p-5 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white font-bold text-sm select-none">
          +
        </span>
        <h3 className="text-green-400 font-bold text-base tracking-tight">Qué funciona</h3>
      </div>

      {/* Bullet list */}
      <ul className="space-y-2.5">
        {verdict.works.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-green-300 font-semibold text-sm leading-snug">{item.title}</p>
              {item.description && (
                <p className="text-green-400 text-xs mt-0.5 leading-relaxed">{item.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function ImproveCard({ verdict }: { verdict: Verdict }) {
  return (
    <motion.div
      custom={1}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex-1 min-w-0 bg-red-500/10 border-l-4 border-red-500 rounded-xl p-5 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white font-bold text-sm select-none">
          -
        </span>
        <h3 className="text-red-400 font-bold text-base tracking-tight">Qué mejorar</h3>
      </div>

      {/* List with ACCIÓN suggestion */}
      <ul className="space-y-3">
        {verdict.improve.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-red-300 font-semibold text-sm leading-snug">{item.title}</p>
              {item.description && (
                <p className="text-red-400 text-xs leading-relaxed">{item.description}</p>
              )}
              {item.action && (
                <p className="text-red-400 text-xs font-medium mt-1">
                  <span className="uppercase font-bold tracking-wide">ACCIÓN:</span>{" "}
                  {item.action}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function OpportunityCard({ verdict }: { verdict: Verdict }) {
  const item = verdict.opportunity;

  return (
    <motion.div
      custom={2}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex-1 min-w-0 bg-blue-500/10 border-l-4 border-blue-500 rounded-xl p-5 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-sm select-none">
          !
        </span>
        <h3 className="text-blue-400 font-bold text-base tracking-tight">Oportunidad oculta</h3>
      </div>

      {/* Single item — bigger text */}
      <div className="flex items-start gap-2">
        <Zap size={14} className="text-blue-400 mt-1 shrink-0" />
        <div className="space-y-1">
          <p className="text-blue-300 font-bold text-base leading-snug">{item.title}</p>
          {item.description && (
            <p className="text-blue-400 text-sm leading-relaxed">{item.description}</p>
          )}
          {item.action && (
            <p className="text-blue-400 text-sm font-medium mt-1">
              <span className="uppercase font-bold tracking-wide">ACCIÓN:</span>{" "}
              {item.action}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ERBenchmarkRow({ metrics }: { metrics: Metrics }) {
  const er = metrics.engagement_rate;
  const benchmark = getNicheBenchmark();

  const hasNoER = er === undefined || er === null || er === 0;

  if (hasNoER) {
    return (
      <div className="card-premium flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
        <Minus size={14} />
        <span>Sin suficientes datos para calcular ER</span>
      </div>
    );
  }

  const rating = erRating(er, benchmark);
  const isAbove = er >= benchmark;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.38 }}
      className="card-premium flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-sm"
    >
      {/* ER estimado */}
      <div className="flex items-center gap-1.5">
        {isAbove
          ? <TrendingUp size={14} className="text-green-400" />
          : <TrendingDown size={14} className="text-red-400" />
        }
        <span className="text-gray-400">ER estimado:</span>
        <span className="font-bold text-white">{er.toFixed(2)}%</span>
      </div>

      {/* Divider */}
      <span className="text-white/20 hidden sm:inline">|</span>

      {/* Benchmark */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-400">Benchmark nicho:</span>
        <span className="font-semibold text-gray-200">{benchmark.toFixed(1)}%</span>
      </div>

      {/* Divider */}
      <span className="text-white/20 hidden sm:inline">|</span>

      {/* Rating badge */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-400">Calificación:</span>
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${rating.color} ${rating.bg}`}
        >
          {rating.label}
        </span>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function VerdictSection({ verdict, metrics, rawAnalysis }: VerdictSectionProps) {
  // If structured verdict is empty but rawAnalysis has content, parse it
  const hasStructuredData = verdict.works.length > 0 || verdict.improve.length > 0;
  let effectiveVerdict = verdict;
  if (!hasStructuredData && rawAnalysis) {
    const parsed = parseVerdictFromRaw(rawAnalysis);
    if (parsed) {
      effectiveVerdict = {
        works: parsed.works,
        improve: parsed.improve,
        opportunity: parsed.opportunity,
      };
    }
  }
  const hasVerdictData = effectiveVerdict.works.length > 0 || effectiveVerdict.improve.length > 0;

  return (
    <section id="verdict" className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-14 space-y-6">

      <SectionHeader
        title="Veredicto"
        subtitle="Análisis completo de fortalezas, áreas de mejora y oportunidades"
        badge="Diagnóstico"
        icon={<Zap size={18} />}
      />

      {hasVerdictData ? (
        /* 3 cards — side by side on desktop, stacked on mobile */
        <div className="flex flex-col sm:flex-row gap-4">
          <WorksCard verdict={effectiveVerdict} />
          <ImproveCard verdict={effectiveVerdict} />
          <OpportunityCard verdict={effectiveVerdict} />
        </div>
      ) : (
        /* Fallback when no verdict data */
        <div className="card-premium border-l-4 border-l-purple-500/50 flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
          <Zap size={32} className="text-purple-500/60" />
          <p className="text-base font-semibold text-gray-400">
            Veredicto detallado próximamente
          </p>
          <p className="text-sm text-gray-500 max-w-md">
            El análisis de fortalezas y oportunidades estará disponible con datos estructurados
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="divider-glow" />

      {/* ER benchmark row */}
      <ERBenchmarkRow metrics={metrics} />

    </section>
  );
}
