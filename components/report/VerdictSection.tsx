"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type { Verdict, Metrics } from "@/types/report";

interface VerdictSectionProps {
  verdict: Verdict;
  metrics: Metrics;
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
  if (ratio >= 1.5) return { label: "EXCELENTE", color: "text-green-700", bg: "bg-green-100" };
  if (ratio >= 1.0) return { label: "BUENO",     color: "text-blue-700",  bg: "bg-blue-100"  };
  if (ratio >= 0.6) return { label: "REGULAR",   color: "text-yellow-700",bg: "bg-yellow-100"};
  return             { label: "BAJO",            color: "text-red-700",   bg: "bg-red-100"   };
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
      className="flex-1 min-w-0 bg-green-50 border-l-4 border-green-600 rounded-xl p-5 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white font-bold text-sm select-none">
          +
        </span>
        <h3 className="text-green-800 font-bold text-base tracking-tight">Qué funciona</h3>
      </div>

      {/* Bullet list */}
      <ul className="space-y-2.5">
        {verdict.works.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-green-900 font-semibold text-sm leading-snug">{item.title}</p>
              {item.description && (
                <p className="text-green-700 text-xs mt-0.5 leading-relaxed">{item.description}</p>
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
      className="flex-1 min-w-0 bg-red-50 border-l-4 border-red-600 rounded-xl p-5 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white font-bold text-sm select-none">
          -
        </span>
        <h3 className="text-red-800 font-bold text-base tracking-tight">Qué mejorar</h3>
      </div>

      {/* List with ACCIÓN suggestion */}
      <ul className="space-y-3">
        {verdict.improve.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <XCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-red-900 font-semibold text-sm leading-snug">{item.title}</p>
              {item.description && (
                <p className="text-red-700 text-xs leading-relaxed">{item.description}</p>
              )}
              {item.action && (
                <p className="text-red-800 text-xs font-medium mt-1">
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
      className="flex-1 min-w-0 bg-blue-50 border-l-4 border-blue-600 rounded-xl p-5 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-sm select-none">
          !
        </span>
        <h3 className="text-blue-800 font-bold text-base tracking-tight">Oportunidad oculta</h3>
      </div>

      {/* Single item — bigger text */}
      <div className="flex items-start gap-2">
        <Zap size={14} className="text-blue-500 mt-1 shrink-0" />
        <div className="space-y-1">
          <p className="text-blue-900 font-bold text-base leading-snug">{item.title}</p>
          {item.description && (
            <p className="text-blue-700 text-sm leading-relaxed">{item.description}</p>
          )}
          {item.action && (
            <p className="text-blue-800 text-sm font-medium mt-1">
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

  if (er === undefined || er === null) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
        <Minus size={14} />
        <span>Sin datos de engagement disponibles</span>
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
      className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
    >
      {/* ER estimado */}
      <div className="flex items-center gap-1.5">
        {isAbove
          ? <TrendingUp size={14} className="text-green-600" />
          : <TrendingDown size={14} className="text-red-500" />
        }
        <span className="text-gray-500">ER estimado:</span>
        <span className="font-bold text-gray-800">{er.toFixed(2)}%</span>
      </div>

      {/* Divider */}
      <span className="text-gray-300 hidden sm:inline">|</span>

      {/* Benchmark */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500">Benchmark nicho:</span>
        <span className="font-semibold text-gray-700">{benchmark.toFixed(1)}%</span>
      </div>

      {/* Divider */}
      <span className="text-gray-300 hidden sm:inline">|</span>

      {/* Rating badge */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-500">Calificación:</span>
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

export default function VerdictSection({ verdict, metrics }: VerdictSectionProps) {
  return (
    <section id="verdict" className="w-full max-w-5xl mx-auto px-4 py-10 sm:py-14 space-y-6">

      <SectionHeader
        title="Veredicto"
        subtitle="Análisis completo de fortalezas, áreas de mejora y oportunidades"
        badge="Diagnóstico"
        icon={<Zap size={18} />}
      />

      {/* 3 cards — side by side on desktop, stacked on mobile */}
      <div className="flex flex-col sm:flex-row gap-4">
        <WorksCard verdict={verdict} />
        <ImproveCard verdict={verdict} />
        <OpportunityCard verdict={verdict} />
      </div>

      {/* ER benchmark row */}
      <ERBenchmarkRow metrics={metrics} />

    </section>
  );
}
