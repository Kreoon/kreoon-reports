"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, TrendingUp, Clock, AlertTriangle, ChevronDown } from "lucide-react";
import type { SuccessMetrics, KPI } from "@/types/report";
import SectionHeader from "@/components/report/shared/SectionHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SuccessMetricsSectionProps {
  metrics: SuccessMetrics;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-widest text-purple-500 font-semibold mb-3">
      {children}
    </p>
  );
}

// ─── A) KPI Grid ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<KPI["status"], { bg: string; text: string; border: string; label: string }> = {
  pending: { bg: "bg-gray-500/10",  text: "text-gray-400",  border: "border-gray-500/30",  label: "Pendiente" },
  met:     { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30", label: "Logrado"   },
  missed:  { bg: "bg-red-500/10",   text: "text-red-400",   border: "border-red-500/30",   label: "No logrado" },
};

function KPICard({ kpi, index }: { kpi: KPI; index: number }) {
  const s = STATUS_STYLES[kpi.status];
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-3 hover:bg-white/8 hover:border-white/15 transition-colors"
    >
      {/* Metric name */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide leading-snug">
        {kpi.metric}
      </p>

      {/* Target value — large */}
      <p className="text-3xl font-black text-white leading-none tabular-nums">
        {kpi.target}
      </p>

      {/* Footer: evaluate_at + status badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock size={10} />
          {kpi.evaluate_at}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${s.bg} ${s.text} ${s.border}`}>
          {s.label}
        </span>
      </div>
    </motion.div>
  );
}

function KPIGrid({ kpis }: { kpis: KPI[] }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
    >
      {kpis.map((kpi, i) => (
        <KPICard key={i} kpi={kpi} index={i} />
      ))}
    </motion.div>
  );
}

// ─── B) Benchmark Bars ────────────────────────────────────────────────────────

interface BenchmarkBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  bgColor: string;
  animate: boolean;
  delay: number;
}

function BenchmarkBar({ label, value, maxValue, color, bgColor, animate, delay }: BenchmarkBarProps) {
  const pct = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;
  const displayVal = value % 1 === 0 ? `${value}%` : `${value.toFixed(1)}%`;

  return (
    <div className="flex items-center gap-3">
      <span className="w-36 sm:w-44 text-xs text-gray-400 shrink-0 leading-snug">{label}</span>
      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: animate ? `${pct}%` : 0 }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      </div>
      <span className="w-12 text-right text-xs font-bold tabular-nums shrink-0" style={{ color }}>
        {displayVal}
      </span>
    </div>
  );
}

function BenchmarkBars({ benchmarks }: { benchmarks: SuccessMetrics["benchmarks"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const maxValue = Math.max(benchmarks.viral_threshold * 1.2, benchmarks.viral_threshold);

  const bars = [
    {
      label:   `Tu estimado (${benchmarks.platform})`,
      value:   benchmarks.good_post,
      color:   "#3B82F6",
      bgColor: "rgba(59,130,246,0.15)",
      delay:   0,
    },
    {
      label:   "Promedio del nicho",
      value:   benchmarks.er_average,
      color:   "#6B7280",
      bgColor: "rgba(107,114,128,0.15)",
      delay:   0.12,
    },
    {
      label:   "Umbral viral",
      value:   benchmarks.viral_threshold,
      color:   "#F59E0B",
      bgColor: "rgba(245,158,11,0.15)",
      delay:   0.24,
    },
  ];

  return (
    <div ref={ref} className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
            <span className="text-xs text-gray-500">{b.label}</span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {bars.map((b) => (
          <BenchmarkBar
            key={b.label}
            label={b.label}
            value={b.value}
            maxValue={maxValue}
            color={b.color}
            bgColor={b.bgColor}
            animate={hasAnimated}
            delay={b.delay}
          />
        ))}
      </div>

      {/* Platform note */}
      <p className="text-xs text-gray-600 italic">
        Tasas de engagement de referencia para {benchmarks.platform}.
      </p>
    </div>
  );
}

// ─── C) Evaluation Timeline ───────────────────────────────────────────────────

function EvaluationTimeline({ timeline }: { timeline: SuccessMetrics["evaluation_timeline"] }) {
  return (
    <div className="relative">
      {/* Horizontal connector line (desktop) */}
      <div className="hidden sm:block absolute top-5 left-0 right-0 h-px bg-white/10 pointer-events-none" style={{ top: "20px" }} />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {timeline.map((milestone, i) => (
          <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center gap-2">
            {/* Node circle */}
            <div className="relative z-10 w-10 h-10 rounded-full bg-[#1a1a1a] border-2 border-purple-500/60 flex items-center justify-center text-purple-400 shrink-0">
              <Clock size={15} />
            </div>

            {/* Label */}
            <span className="text-sm font-black text-white">{milestone.label}</span>

            {/* Checks */}
            <ul className="space-y-1 text-left w-full">
              {milestone.checks.map((check, ci) => (
                <li
                  key={ci}
                  className="flex items-start gap-1.5 text-xs text-gray-400 leading-snug"
                >
                  <span className="mt-0.5 shrink-0 text-purple-500">›</span>
                  {check}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── D) Plan B ────────────────────────────────────────────────────────────────

function PlanBCard({ steps }: { steps: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-xl overflow-hidden border border-yellow-500/25"
    >
      {/* Collapsible header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-yellow-500/8 hover:bg-yellow-500/12 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
            <AlertTriangle size={15} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-yellow-300">Si no funciona...</p>
            <p className="text-xs text-gray-500">Plan B de contingencia</p>
          </div>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-gray-400 shrink-0"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="plan-b-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 space-y-2 bg-yellow-500/5 border-t border-yellow-500/15">
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-300 leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SuccessMetricsSection({ metrics }: SuccessMetricsSectionProps) {
  return (
    <section id="metrics" className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <div className="bg-[#1a1a1a] rounded-2xl p-6 sm:p-8 space-y-10">

        {/* Section header */}
        <SectionHeader
          icon={<Target size={18} />}
          title="Métricas de Éxito"
          subtitle="KPIs, benchmarks y plan de evaluación para medir el rendimiento"
          badge="MÉTRICAS"
        />

        {/* ── A) KPI Grid ── */}
        <div className="space-y-4">
          <SubHeading>KPIs Objetivo</SubHeading>
          <KPIGrid kpis={metrics.kpis} />
        </div>

        <div className="h-px bg-white/10" />

        {/* ── B) Benchmark Bars ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={13} className="text-purple-500" />
            <SubHeading>Benchmarks de Engagement</SubHeading>
          </div>
          <BenchmarkBars benchmarks={metrics.benchmarks} />
        </div>

        <div className="h-px bg-white/10" />

        {/* ── C) Evaluation Timeline ── */}
        <div className="space-y-4">
          <SubHeading>Timeline de Evaluación</SubHeading>
          <EvaluationTimeline timeline={metrics.evaluation_timeline} />
        </div>

        <div className="h-px bg-white/10" />

        {/* ── D) Plan B ── */}
        <div className="space-y-3">
          <SubHeading>Contingencia</SubHeading>
          <PlanBCard steps={metrics.plan_b} />
        </div>

      </div>
    </section>
  );
}
