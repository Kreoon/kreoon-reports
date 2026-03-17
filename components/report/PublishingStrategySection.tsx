"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Send, Hash, RefreshCw, LayoutGrid } from "lucide-react";
import type { PublishStrategy } from "@/types/report";
import SectionHeader from "@/components/report/shared/SectionHeader";
import CopyButton from "@/components/report/shared/CopyButton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublishingStrategySectionProps {
  strategy: PublishStrategy;
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
    <p className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">
      {children}
    </p>
  );
}

// ─── A) Best Time Card ────────────────────────────────────────────────────────

function BestTimeCard({ strategy }: { strategy: PublishStrategy }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-5"
    >
      {/* Glow accent */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/10 blur-2xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon */}
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
          <Clock size={24} />
        </div>

        {/* Main info */}
        <div className="flex-1 space-y-1">
          <p className="text-xs uppercase tracking-widest font-semibold text-orange-400">
            Mejor momento para publicar
          </p>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {strategy.best_day}
            </span>
            <span className="text-lg font-bold text-orange-400">
              {strategy.best_time}
            </span>
            <span className="text-sm text-gray-400 font-medium">
              ({strategy.timezone})
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
            {strategy.reason}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── B) Post-Publish Timeline ─────────────────────────────────────────────────

const TIME_LABELS: Record<number, string> = {
  0:   "Al publicar",
  1:   "1 min",
  5:   "5 min",
  30:  "30 min",
  60:  "1 hora",
  120: "2 horas",
};

function getTimeLabel(min: number): string {
  return TIME_LABELS[min] ?? `${min} min`;
}

function PostPublishTimeline({ actions }: { actions: PublishStrategy["post_actions"] }) {
  return (
    <div className="relative space-y-0">
      {/* Vertical gutter line */}
      <div className="absolute left-[52px] top-0 bottom-0 w-px bg-white/10 pointer-events-none" />

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
        {actions.map((action, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="relative flex gap-4 pb-5 last:pb-0"
          >
            {/* Time stamp */}
            <div className="shrink-0 w-[52px] flex flex-col items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-orange-400 tabular-nums text-center leading-tight">
                {getTimeLabel(action.minutes_after)}
              </span>
              {/* Node */}
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 border-2 border-[#1a1a1a] ring-1 ring-orange-500/40" />
            </div>

            {/* Action card */}
            <div className="flex-1 bg-white/5 rounded-xl px-4 py-3 border border-white/5 hover:border-white/10 transition-colors">
              <p className="text-sm text-gray-200 leading-snug">{action.action}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── C) Caption Final ─────────────────────────────────────────────────────────

function CaptionCard({ caption }: { caption: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-xl overflow-hidden border border-white/10"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/8">
        <div className="flex items-center gap-2 text-gray-400">
          <Send size={13} />
          <span className="text-xs font-semibold uppercase tracking-wide">Caption final</span>
        </div>
        <CopyButton text={caption} label="Copiar caption" />
      </div>

      {/* Caption body */}
      <div className="bg-[#f5f0e8]/5 px-5 py-4">
        <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{caption}</p>
      </div>
    </motion.div>
  );
}

// ─── D) Hashtags Final ────────────────────────────────────────────────────────

function HashtagsCard({ hashtags }: { hashtags: string[] }) {
  const hashtagText = hashtags.join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-xl overflow-hidden border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/8">
        <div className="flex items-center gap-2 text-gray-400">
          <Hash size={13} />
          <span className="text-xs font-semibold uppercase tracking-wide">Hashtags finales</span>
          <span className="text-xs text-gray-600">({hashtags.length})</span>
        </div>
        <CopyButton text={hashtagText} label="Copiar todos" />
      </div>

      {/* Pills */}
      <div className="px-4 py-4 flex flex-wrap gap-2">
        {hashtags.map((tag) => (
          <span
            key={tag}
            className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-default"
          >
            {tag.startsWith("#") ? tag : `#${tag}`}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── E) Repurposing Table ─────────────────────────────────────────────────────

function RepurposingTable({ items }: { items: PublishStrategy["repurposing"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-xl overflow-hidden border border-white/10"
    >
      {/* Orange header row */}
      <div className="grid grid-cols-3 bg-orange-500/20 border-b border-orange-500/30">
        {["Plataforma", "Formato", "Adaptación"].map((col) => (
          <div
            key={col}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-orange-300"
          >
            {col}
          </div>
        ))}
      </div>

      {/* Rows */}
      {items.map((item, i) => (
        <div
          key={i}
          className={`grid grid-cols-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${
            i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
          }`}
        >
          <div className="px-4 py-3 text-sm font-semibold text-white">{item.platform}</div>
          <div className="px-4 py-3 text-sm text-gray-300">{item.format}</div>
          <div className="px-4 py-3 text-sm text-gray-400 leading-snug">{item.adaptation}</div>
        </div>
      ))}
    </motion.div>
  );
}

// ─── F) Week Plan ─────────────────────────────────────────────────────────────

function WeekPlanGrid({ days }: { days: PublishStrategy["week_plan"] }) {
  // Split into two weeks if more than 7 days
  const week1 = days.slice(0, 7);
  const week2 = days.slice(7, 14);

  return (
    <div className="space-y-4">
      {[week1, week2].filter((w) => w.length > 0).map((week, wi) => (
        <div key={wi}>
          {week2.length > 0 && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Semana {wi + 1}
            </p>
          )}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
          >
            {week.map((d, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white/5 border border-white/8 rounded-xl p-3 space-y-1 hover:bg-white/8 hover:border-white/15 transition-colors"
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-orange-400">
                  {d.day}
                </p>
                <p className="text-xs text-gray-300 leading-snug">{d.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PublishingStrategySection({ strategy }: PublishingStrategySectionProps) {
  return (
    <section id="publishing" className="w-full max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <div className="bg-[#1a1a1a] rounded-2xl p-6 sm:p-8 space-y-10">

        {/* Section header */}
        <SectionHeader
          icon={<Calendar size={18} />}
          title="Estrategia de Publicación"
          subtitle="Plan completo para maximizar el alcance de tu contenido"
          badge="PUBLICACIÓN"
        />

        {/* ── A) Best Time ── */}
        <div className="space-y-3">
          <SubHeading>Mejor Momento</SubHeading>
          <BestTimeCard strategy={strategy} />
        </div>

        <div className="h-px bg-white/10" />

        {/* ── B) Post-Publish Timeline ── */}
        <div className="space-y-4">
          <SubHeading>Acciones Post-publicación</SubHeading>
          <PostPublishTimeline actions={strategy.post_actions} />
        </div>

        <div className="h-px bg-white/10" />

        {/* ── C) Caption Final ── */}
        <div className="space-y-3">
          <SubHeading>Caption Final</SubHeading>
          <CaptionCard caption={strategy.caption_final} />
        </div>

        {/* ── D) Hashtags Final ── */}
        <div className="space-y-3">
          <SubHeading>Hashtags Finales</SubHeading>
          <HashtagsCard hashtags={strategy.hashtags_final} />
        </div>

        <div className="h-px bg-white/10" />

        {/* ── E) Repurposing Table ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <RefreshCw size={13} className="text-orange-500" />
            <SubHeading>Repurposing</SubHeading>
          </div>
          <RepurposingTable items={strategy.repurposing} />
        </div>

        <div className="h-px bg-white/10" />

        {/* ── F) Week Plan ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <LayoutGrid size={13} className="text-orange-500" />
            <SubHeading>Plan de la Semana</SubHeading>
          </div>
          <WeekPlanGrid days={strategy.week_plan} />
        </div>

      </div>
    </section>
  );
}
