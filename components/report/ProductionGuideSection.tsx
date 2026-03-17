"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Monitor,
  Sun,
  Mic,
  Image,
  Scissors,
  Music,
  CheckSquare,
  Square,
} from "lucide-react";
import type { ProductionGuide, ScriptLine } from "@/types/report";
import SectionHeader from "@/components/report/shared/SectionHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductionGuideSectionProps {
  guide: ProductionGuide;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SECTION_COLORS: Record<ScriptLine["section"], { bg: string; text: string; border: string }> = {
  hook:        { bg: "bg-red-500/15",  text: "text-red-400",   border: "border-red-500/40" },
  development: { bg: "bg-blue-500/15", text: "text-blue-400",  border: "border-blue-500/40" },
  cta:         { bg: "bg-green-500/15",text: "text-green-400", border: "border-green-500/40" },
  transition:  { bg: "bg-purple-500/15",text: "text-purple-400",border: "border-purple-500/40" },
};

const SECTION_LABELS: Record<ScriptLine["section"], string> = {
  hook:        "Hook",
  development: "Desarrollo",
  cta:         "CTA",
  transition:  "Transición",
};

const SETUP_FIELDS: {
  key: keyof ProductionGuide["setup"];
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "camera",     label: "Cámara",      icon: <Camera size={16} /> },
  { key: "resolution", label: "Resolución",   icon: <Monitor size={16} /> },
  { key: "lighting",   label: "Iluminación",  icon: <Sun size={16} /> },
  { key: "audio",      label: "Audio",        icon: <Mic size={16} /> },
  { key: "background", label: "Fondo",        icon: <Image size={16} /> },
  { key: "editing",    label: "Edición",      icon: <Scissors size={16} /> },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">
      {children}
    </p>
  );
}

// ─── A) Pre-recording Checklist ───────────────────────────────────────────────

function ChecklistBlock({ checklist }: { checklist: ProductionGuide["checklist"] }) {
  const allItems = checklist.flatMap((g) => g.items);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const total     = allItems.length;
  const doneCount = checked.size;
  const pct       = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-medium">Progreso</span>
          <span className="text-white font-bold tabular-nums">
            {doneCount}/{total}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
        <div className="text-right text-xs text-gray-500">{pct}% completado</div>
      </div>

      {/* Groups */}
      {checklist.map((group) => (
        <div key={group.group} className="space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            {group.group}
          </p>
          <div className="space-y-1.5">
            {group.items.map((item) => {
              const key = `${group.group}::${item}`;
              const isChecked = checked.has(key);
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className="w-full flex items-start gap-3 text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-150 group"
                >
                  <span className={`mt-0.5 shrink-0 transition-colors duration-150 ${isChecked ? "text-green-400" : "text-gray-500 group-hover:text-gray-300"}`}>
                    {isChecked
                      ? <CheckSquare size={15} />
                      : <Square size={15} />
                    }
                  </span>
                  <span
                    className={`text-sm leading-snug transition-all duration-150 ${
                      isChecked
                        ? "line-through text-gray-500"
                        : "text-gray-200"
                    }`}
                  >
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── B) Script Timeline ───────────────────────────────────────────────────────

function ScriptTimeline({ lines }: { lines: ScriptLine[] }) {
  return (
    <div className="relative space-y-0">
      {/* Vertical gutter line */}
      <div className="absolute left-[60px] top-0 bottom-0 w-px bg-white/10 pointer-events-none" />

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
        {lines.map((line, i) => {
          const colors = SECTION_COLORS[line.section] ?? SECTION_COLORS.transition;
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {/* Left gutter: timestamp pill + node dot */}
              <div className="shrink-0 w-[60px] flex flex-col items-center gap-1.5 pt-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border} tabular-nums whitespace-nowrap`}
                >
                  {line.time}
                </span>
                {/* Node dot */}
                <div className={`w-2.5 h-2.5 rounded-full border-2 bg-[#0A0A0A] ${colors.border}`} />
              </div>

              {/* Content card */}
              <div className="flex-1 bg-white/5 rounded-xl p-4 space-y-2 border border-white/5 hover:border-white/10 transition-colors">
                {/* Section label */}
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}
                >
                  {SECTION_LABELS[line.section]}
                </span>

                {/* Spoken text */}
                <p className="text-sm text-white leading-relaxed">{line.text}</p>

                {/* Camera direction */}
                {line.direction && (
                  <p className="text-xs italic text-gray-500 leading-snug">
                    {line.direction}
                  </p>
                )}

                {/* On-screen text */}
                {line.on_screen_text && (
                  <div className="mt-1">
                    <span className="inline-block font-mono text-[11px] px-2.5 py-1 rounded-md bg-white/10 text-orange-300 border border-orange-500/20 leading-normal">
                      {line.on_screen_text}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─── C) Technical Setup ───────────────────────────────────────────────────────

function TechnicalSetupGrid({ setup }: { setup: ProductionGuide["setup"] }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-2 sm:grid-cols-3 gap-3"
    >
      {SETUP_FIELDS.map(({ key, label, icon }) => (
        <motion.div
          key={key}
          variants={fadeUp}
          className="bg-white/5 border border-white/8 rounded-xl p-4 space-y-2 hover:bg-white/8 hover:border-white/15 transition-colors"
        >
          <div className="flex items-center gap-2 text-orange-400">
            {icon}
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {label}
            </span>
          </div>
          <p className="text-sm text-white font-medium leading-snug">{setup[key]}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── D) Music ─────────────────────────────────────────────────────────────────

function MusicCard({ music }: { music: ProductionGuide["music"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      {/* Icon */}
      <div className="shrink-0 w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
        <Music size={22} />
      </div>

      {/* Info */}
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-white font-semibold text-sm">{music.type}</p>
          {music.trending && music.name && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30 uppercase tracking-wide">
              🔥 Trending — {music.name}
            </span>
          )}
          {!music.trending && music.name && (
            <span className="text-xs text-gray-400">— {music.name}</span>
          )}
        </div>
        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-300">Volumen:</span> {music.volume_recommendation}
        </p>
        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-300">Fuente:</span> {music.source}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProductionGuideSection({ guide }: ProductionGuideSectionProps) {
  return (
    <section id="production" className="w-full max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <div className="bg-[#1a1a1a] rounded-2xl p-6 sm:p-8 space-y-10">

        {/* Section header */}
        <SectionHeader
          icon={<Camera size={18} />}
          title="Guía de Producción"
          subtitle="Todo lo que necesitas para grabar y producir este contenido"
          badge="PRODUCCIÓN"
        />

        {/* ── A) Pre-recording Checklist ── */}
        <div className="space-y-4">
          <SubHeading>Pre-grabación — Checklist</SubHeading>
          <ChecklistBlock checklist={guide.checklist} />
        </div>

        <div className="h-px bg-white/10" />

        {/* ── B) Script Timeline ── */}
        <div className="space-y-4">
          <SubHeading>Timeline del Guión</SubHeading>
          <ScriptTimeline lines={guide.script_timeline} />
        </div>

        <div className="h-px bg-white/10" />

        {/* ── C) Technical Setup ── */}
        <div className="space-y-4">
          <SubHeading>Setup Técnico</SubHeading>
          <TechnicalSetupGrid setup={guide.setup} />
        </div>

        <div className="h-px bg-white/10" />

        {/* ── D) Music ── */}
        <div className="space-y-4">
          <SubHeading>Música Sugerida</SubHeading>
          <MusicCard music={guide.music} />
        </div>

      </div>
    </section>
  );
}
