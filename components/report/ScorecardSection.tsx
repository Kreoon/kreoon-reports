"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Lightbulb, Eye, Heart, MessageCircle, BarChart2 } from "lucide-react";
import type { Scores, Metrics, Verdict } from "@/types/report";

interface ScorecardSectionProps {
  scores: Scores;
  metrics: Metrics;
  verdict: Verdict;
}

const SCORE_BARS: { key: keyof Omit<Scores, "total" | "replication_difficulty">; label: string }[] = [
  { key: "hook",       label: "Hook" },
  { key: "copy",       label: "Copy" },
  { key: "strategy",   label: "Estrategia" },
  { key: "production", label: "Producción" },
  { key: "virality",   label: "Viralidad" },
];

function scoreColor(score: number): string {
  if (score >= 9)  return "#FFB800"; // gold
  if (score >= 7)  return "#22C55E"; // green
  if (score >= 4)  return "#F97316"; // orange
  return "#EF4444";                  // red
}

function formatNumber(n?: number): string {
  if (n === undefined || n === null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("es-CO");
}

function ScoreBar({
  label,
  score,
  index,
  animate,
}: {
  label: string;
  score: number;
  index: number;
  animate: boolean;
}) {
  const color = scoreColor(score);
  const targetWidth = `${score * 10}%`;

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Label */}
      <span className="w-24 sm:w-28 text-sm text-gray-400 shrink-0">{label}</span>

      {/* Bar track */}
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: animate ? targetWidth : 0 }}
          transition={{
            duration: 0.7,
            delay: animate ? index * 0.1 : 0,
            ease: "easeOut",
          }}
        />
      </div>

      {/* Score */}
      <span
        className="w-8 text-right text-sm font-bold tabular-nums shrink-0"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

export default function ScorecardSection({ scores, metrics, verdict }: ScorecardSectionProps) {
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
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const totalColor = scoreColor(scores.total);
  const erFormatted =
    metrics.engagement_rate !== undefined
      ? `${metrics.engagement_rate.toFixed(2)}%`
      : "—";

  return (
    <section
      id="scorecard"
      ref={ref}
      className="w-full max-w-3xl mx-auto px-4 py-10 sm:py-14"
    >
      <div className="bg-[#1a1a1a] rounded-2xl p-6 sm:p-8 space-y-8">

        {/* ── Section header ── */}
        <div>
          <p className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-1">
            Análisis de rendimiento
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Scorecard</h2>
        </div>

        {/* ── Score bars ── */}
        <div className="space-y-4">
          {SCORE_BARS.map(({ key, label }, i) => (
            <ScoreBar
              key={key}
              label={label}
              score={scores[key]}
              index={i}
              animate={hasAnimated}
            />
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-white/10" />

        {/* ── Total score row ── */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="w-24 sm:w-28 text-sm font-bold text-white shrink-0">Total</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: totalColor }}
              initial={{ width: 0 }}
              animate={{ width: hasAnimated ? `${scores.total * 10}%` : 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
            />
          </div>
          <span
            className="w-8 text-right text-base font-extrabold tabular-nums shrink-0"
            style={{ color: totalColor }}
          >
            {scores.total}
          </span>
        </div>

        {/* ── Replication badge ── */}
        <div>
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border"
            style={{
              borderColor: scoreColor(scores.replication_difficulty),
              color: scoreColor(scores.replication_difficulty),
              backgroundColor: `${scoreColor(scores.replication_difficulty)}15`,
            }}
          >
            <BarChart2 size={14} />
            Nivel para replicar: {scores.replication_difficulty}/10
          </span>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-white/10" />

        {/* ── Verdict badges ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Strength — first item of works[] */}
          {verdict.works[0] && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: hasAnimated ? 1 : 0, y: hasAnimated ? 0 : 12 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-[#0f1a12] border-l-4 border-green-500 rounded-lg p-4 space-y-1"
            >
              <div className="flex items-center gap-2 text-green-400 font-semibold text-xs uppercase tracking-wide">
                <TrendingUp size={13} />
                Fortaleza
              </div>
              <p className="text-white text-sm font-medium leading-snug">
                {verdict.works[0].title}
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                {verdict.works[0].description}
              </p>
            </motion.div>
          )}

          {/* Weakness — first item of improve[] */}
          {verdict.improve[0] && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: hasAnimated ? 1 : 0, y: hasAnimated ? 0 : 12 }}
              transition={{ duration: 0.4, delay: 0.72 }}
              className="bg-[#1a0f0f] border-l-4 border-red-500 rounded-lg p-4 space-y-1"
            >
              <div className="flex items-center gap-2 text-red-400 font-semibold text-xs uppercase tracking-wide">
                <AlertTriangle size={13} />
                Debilidad
              </div>
              <p className="text-white text-sm font-medium leading-snug">
                {verdict.improve[0].title}
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                {verdict.improve[0].description}
              </p>
            </motion.div>
          )}

          {/* Opportunity */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: hasAnimated ? 1 : 0, y: hasAnimated ? 0 : 12 }}
            transition={{ duration: 0.4, delay: 0.84 }}
            className="bg-[#0d1220] border-l-4 border-blue-500 rounded-lg p-4 space-y-1"
          >
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-wide">
              <Lightbulb size={13} />
              Oportunidad
            </div>
            <p className="text-white text-sm font-medium leading-snug">
              {verdict.opportunity.title}
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              {verdict.opportunity.description}
            </p>
          </motion.div>

        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-white/10" />

        {/* ── Metrics row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

          <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center gap-1">
            <Eye size={16} className="text-orange-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Vistas</span>
            <span className="text-lg font-bold text-white tabular-nums">
              {formatNumber(metrics.views)}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center gap-1">
            <Heart size={16} className="text-pink-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Likes</span>
            <span className="text-lg font-bold text-white tabular-nums">
              {formatNumber(metrics.likes)}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center gap-1">
            <MessageCircle size={16} className="text-blue-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Comentarios</span>
            <span className="text-lg font-bold text-white tabular-nums">
              {formatNumber(metrics.comments)}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center gap-1">
            <BarChart2 size={16} className="text-green-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">ER%</span>
            <span className="text-lg font-bold text-white tabular-nums">
              {erFormatted}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
