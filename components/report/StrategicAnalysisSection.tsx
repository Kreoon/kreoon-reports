"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Zap,
  TrendingUp,
  MousePointerClick,
  Layout,
  FileText,
  Tag,
  Brain,
  BarChart2,
  Target,
  Layers,
  DollarSign,
  Share2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { StrategicAnalysis, Scores, PowerWord } from "@/types/report";
import SectionHeader from "./shared/SectionHeader";

// ─── ScoreBadge (inline since no shared file exists yet) ───────────────────
function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 9
      ? "#FFB800"
      : score >= 7
      ? "#22C55E"
      : score >= 4
      ? "#7c3aed"
      : "#EF4444";
  return (
    <span
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-extrabold tabular-nums shrink-0"
      style={{ color, backgroundColor: `${color}18`, border: `1px solid ${color}40` }}
    >
      {score}
    </span>
  );
}

// ─── Shared helpers ────────────────────────────────────────────────────────
function scoreColor(score: number): string {
  if (score >= 9) return "#FFB800";
  if (score >= 7) return "#22C55E";
  if (score >= 4) return "#7c3aed";
  return "#EF4444";
}

function effectivenessLevel(score: number): { label: string; color: string } {
  if (score >= 8) return { label: "ALTO", color: "#22C55E" };
  if (score >= 5) return { label: "MED", color: "#7c3aed" };
  return { label: "BAJO", color: "#EF4444" };
}

function Tag_({ children, color = "#6B7280" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {children}
    </span>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs text-gray-400 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="w-8 text-right text-xs font-bold tabular-nums" style={{ color }}>
        {value}%
      </span>
    </div>
  );
}

// ─── Expandable Card ───────────────────────────────────────────────────────
interface CardProps {
  icon: React.ReactNode;
  title: string;
  score: number;
  preview: React.ReactNode;
  detail: React.ReactNode;
  index?: number;
}

function DimensionCard({ icon, title, score, preview, detail, index = 0 }: CardProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-[#1a1a1a] rounded-xl border border-white/[0.08] overflow-hidden"
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center text-gray-400">
          {icon}
        </div>
        <span className="flex-1 text-sm font-semibold text-white truncate">{title}</span>

        {/* Collapsed preview — tags */}
        {!open && (
          <div className="hidden sm:flex items-center gap-2 max-w-[160px] overflow-hidden">
            {preview}
          </div>
        )}

        <ScoreBadge score={score} />

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-gray-500"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* Expandable body */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <div className="px-4 pb-4 pt-1 border-t border-white/[0.08] space-y-3">{detail}</div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB IDs
// ═══════════════════════════════════════════════════════════════════════════
type TabId = "estructura" | "copy" | "estrategia";

const TABS: { id: TabId; label: string; color: string }[] = [
  { id: "estructura", label: "ESTRUCTURA", color: "#3B82F6" },
  { id: "copy", label: "COPY", color: "#7c3aed" },
  { id: "estrategia", label: "ESTRATEGIA", color: "#22C55E" },
];

// ─── Power word category colors ───────────────────────────────────────────
const WORD_CATEGORY_COLORS: Record<PowerWord["category"], string> = {
  urgency: "#EF4444",
  trust: "#22C55E",
  desire: "#7c3aed",
  ease: "#3B82F6",
  fear: "#A855F7",
  social: "#EC4899",
};

// ═══════════════════════════════════════════════════════════════════════════
// BLOCKS
// ═══════════════════════════════════════════════════════════════════════════

function StructureBlock({ s }: { s: StrategicAnalysis["structure"] }) {
  // 1. Hook
  const hookCard = (
    <DimensionCard
      index={0}
      icon={<Zap size={15} />}
      title="Hook"
      score={s.hook.score}
      preview={
        <>
          {s.hook.tags?.slice(0, 2).map((t) => (
            <Tag_ key={t} color="#3B82F6">{t}</Tag_>
          ))}
        </>
      }
      detail={
        <div className="space-y-3">
          {/* Score bar */}
          <ScoreBar label="Fuerza hook" value={s.hook.score * 10} color={scoreColor(s.hook.score)} />
          {/* Tags */}
          {s.hook.tags && s.hook.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {s.hook.tags.map((t) => (
                <Tag_ key={t} color="#3B82F6">{t}</Tag_>
              ))}
            </div>
          )}
          {/* Description */}
          <p className="text-xs text-gray-400 leading-relaxed">{s.hook.description}</p>
          {/* Recommendation */}
          {s.hook.recommendation && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-xs text-blue-300 leading-relaxed">
                <span className="font-semibold text-blue-400">Recomendación: </span>
                {s.hook.recommendation}
              </p>
            </div>
          )}
        </div>
      }
    />
  );

  // 2. Development
  const devCard = (
    <DimensionCard
      index={1}
      icon={<TrendingUp size={15} />}
      title="Desarrollo"
      score={s.development.score}
      preview={null}
      detail={
        <div className="space-y-3">
          <ScoreBar
            label="Retención"
            value={s.development.score * 10}
            color={scoreColor(s.development.score)}
          />
          <p className="text-xs text-gray-400 leading-relaxed">
            {s.development.description}
            {s.development.description.toLowerCase().includes("pastor") && (
              <span className="ml-1 inline-block px-1.5 py-0.5 rounded text-xs font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30">
                PASTOR
              </span>
            )}
          </p>
          {s.development.tags && s.development.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {s.development.tags.map((t) => (
                <Tag_ key={t} color="#7c3aed">{t}</Tag_>
              ))}
            </div>
          )}
          {s.development.recommendation && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <p className="text-xs text-purple-300 leading-relaxed">
                <span className="font-semibold text-purple-400">Recomendación: </span>
                {s.development.recommendation}
              </p>
            </div>
          )}
        </div>
      }
    />
  );

  // 3. CTA
  const { label: effLabel, color: effColor } = effectivenessLevel(s.cta.score);
  const ctaCard = (
    <DimensionCard
      index={2}
      icon={<MousePointerClick size={15} />}
      title="CTA"
      score={s.cta.score}
      preview={
        <span
          className="text-xs font-bold px-2 py-0.5 rounded"
          style={{ color: effColor, backgroundColor: `${effColor}20` }}
        >
          {effLabel}
        </span>
      }
      detail={
        <div className="space-y-3">
          {/* Effectiveness badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Efectividad:</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{ color: effColor, backgroundColor: `${effColor}20`, border: `1px solid ${effColor}40` }}
            >
              {effLabel}
            </span>
            {/* CTA type tag */}
            {s.cta.tags && s.cta.tags[0] && (
              <Tag_ color="#A855F7">{s.cta.tags[0]}</Tag_>
            )}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{s.cta.description}</p>
          {/* Micro-commitment check */}
          <div className="flex items-center gap-2">
            {s.cta.score >= 6 ? (
              <>
                <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                <span className="text-xs text-green-400">Micro-compromiso detectado</span>
              </>
            ) : (
              <>
                <XCircle size={14} className="text-red-400 shrink-0" />
                <span className="text-xs text-red-400">Sin micro-compromiso</span>
              </>
            )}
          </div>
          {s.cta.recommendation && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <p className="text-xs text-purple-300 leading-relaxed">
                <span className="font-semibold text-purple-400">Recomendación: </span>
                {s.cta.recommendation}
              </p>
            </div>
          )}
        </div>
      }
    />
  );

  // 4. Format
  const repurposing = s.format.tags ?? [];
  const formatTag = s.format.description.split(" ")[0];
  const formatCard = (
    <DimensionCard
      index={3}
      icon={<Layout size={15} />}
      title="Formato"
      score={s.format.score}
      preview={<Tag_ color="#22C55E">{formatTag}</Tag_>}
      detail={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {s.format.tags?.map((t) => (
              <Tag_ key={t} color="#22C55E">{t}</Tag_>
            ))}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{s.format.description}</p>
          {/* Repurposing chips */}
          {repurposing.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Repurposing</p>
              <div className="flex flex-wrap gap-1.5">
                {repurposing.map((r) => (
                  <span
                    key={r}
                    className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-gray-300 border border-white/10"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
          {s.format.recommendation && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-xs text-green-300 leading-relaxed">
                <span className="font-semibold text-green-400">Recomendación: </span>
                {s.format.recommendation}
              </p>
            </div>
          )}
        </div>
      }
    />
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {hookCard}
      {devCard}
      {ctaCard}
      {formatCard}
    </div>
  );
}

// ─── Copy Block ────────────────────────────────────────────────────────────
function CopyBlock({ c }: { c: StrategicAnalysis["copy"] }) {
  // 5. Formula
  const formulaCard = (
    <DimensionCard
      index={0}
      icon={<FileText size={15} />}
      title="Fórmula"
      score={c.formula.score}
      preview={<Tag_ color="#7c3aed">{c.formula.detected}</Tag_>}
      detail={
        <div className="space-y-3">
          {/* Big formula name */}
          <div className="flex items-center justify-center py-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-2xl font-black tracking-widest text-purple-400">
              {c.formula.detected}
            </span>
          </div>
          {/* Confidence */}
          <ScoreBar
            label="Confianza"
            value={c.formula.confidence}
            color="#7c3aed"
          />
          {/* Description (step breakdown) */}
          <p className="text-xs text-gray-400 leading-relaxed">{c.formula.description}</p>
          {c.formula.tags && c.formula.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {c.formula.tags.map((t) => (
                <Tag_ key={t} color="#7c3aed">{t}</Tag_>
              ))}
            </div>
          )}
          {c.formula.recommendation && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <p className="text-xs text-purple-300 leading-relaxed">
                <span className="font-semibold text-purple-400">Recomendación: </span>
                {c.formula.recommendation}
              </p>
            </div>
          )}
        </div>
      }
    />
  );

  // 6. Power Words
  const powerWordsCard = (
    <DimensionCard
      index={1}
      icon={<Tag size={15} />}
      title="Palabras de Poder"
      score={c.power_words.score}
      preview={
        <span className="text-xs text-gray-400">{c.power_words.words.length} detectadas</span>
      }
      detail={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {c.power_words.words.map((pw) => (
              <span
                key={pw.word}
                title={pw.effect}
                className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold cursor-default"
                style={{
                  backgroundColor: `${WORD_CATEGORY_COLORS[pw.category]}20`,
                  color: WORD_CATEGORY_COLORS[pw.category],
                  border: `1px solid ${WORD_CATEGORY_COLORS[pw.category]}40`,
                }}
              >
                {pw.word}
              </span>
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-2 pt-1">
            {(Object.entries(WORD_CATEGORY_COLORS) as [PowerWord["category"], string][]).map(
              ([cat, col]) => (
                <div key={cat} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col }} />
                  <span className="text-xs text-gray-500 capitalize">{cat}</span>
                </div>
              )
            )}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{c.power_words.description}</p>
        </div>
      }
    />
  );

  // 7. Mental Triggers
  const triggersCard = (
    <DimensionCard
      index={2}
      icon={<Brain size={15} />}
      title="Gatillos Mentales"
      score={c.mental_triggers.score}
      preview={
        <span className="text-xs text-gray-400">
          {c.mental_triggers.used.length} usados · {c.mental_triggers.missing.length} faltantes
        </span>
      }
      detail={
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Used */}
            <div>
              <p className="text-xs font-semibold text-green-400 mb-2 uppercase tracking-wide">
                Usados
              </p>
              <ul className="space-y-1">
                {c.mental_triggers.used.map((t) => (
                  <li key={t} className="flex items-start gap-1.5">
                    <CheckCircle2 size={12} className="text-green-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-gray-300">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Missing */}
            <div>
              <p className="text-xs font-semibold text-red-400 mb-2 uppercase tracking-wide">
                Faltantes
              </p>
              <ul className="space-y-1">
                {c.mental_triggers.missing.map((t) => (
                  <li key={t} className="flex items-start gap-1.5">
                    <XCircle size={12} className="text-red-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-gray-300">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{c.mental_triggers.description}</p>
        </div>
      }
    />
  );

  // 8. Tone
  const { brain, disc } = c.tone;
  const toneCard = (
    <DimensionCard
      index={3}
      icon={<BarChart2 size={15} />}
      title="Tono"
      score={c.tone.score}
      preview={<Tag_ color="#A855F7">{disc}</Tag_>}
      detail={
        <div className="space-y-3">
          {/* Brain Triuno bars */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Cerebro Triuno</p>
            <ScoreBar label="Reptiliano" value={brain.reptilian} color="#EF4444" />
            <ScoreBar label="Límbico" value={brain.limbic} color="#7c3aed" />
            <ScoreBar label="Neocortex" value={brain.neocortex} color="#3B82F6" />
          </div>
          {/* DISC Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Perfil DISC:</span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              {disc}
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{c.tone.description}</p>
          {c.tone.tags && c.tone.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {c.tone.tags.map((t) => (
                <Tag_ key={t} color="#A855F7">{t}</Tag_>
              ))}
            </div>
          )}
        </div>
      }
    />
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {formulaCard}
      {powerWordsCard}
      {triggersCard}
      {toneCard}
    </div>
  );
}

// ─── Strategy Block ────────────────────────────────────────────────────────
const PILLAR_COLORS: Record<string, string> = {
  Educar: "#3B82F6",
  Entretener: "#7c3aed",
  Inspirar: "#A855F7",
  Vender: "#22C55E",
};

function StrategyBlock({ s }: { s: StrategicAnalysis["strategy"] }) {
  // 9. Funnel
  const funnelLevels: ("TOFU" | "MOFU" | "BOFU")[] = ["TOFU", "MOFU", "BOFU"];
  const funnelColors: Record<string, string> = {
    TOFU: "#3B82F6",
    MOFU: "#7c3aed",
    BOFU: "#22C55E",
  };
  const funnelLabels: Record<string, string> = {
    TOFU: "Conciencia",
    MOFU: "Consideración",
    BOFU: "Conversión",
  };
  const funnelCard = (
    <DimensionCard
      index={0}
      icon={<Target size={15} />}
      title="Embudo"
      score={s.funnel.score}
      preview={<Tag_ color={funnelColors[s.funnel.stage]}>{s.funnel.stage}</Tag_>}
      detail={
        <div className="space-y-3">
          {/* 3-tier funnel visual */}
          <div className="flex flex-col items-center gap-1 py-2">
            {funnelLevels.map((level, i) => {
              const active = level === s.funnel.stage;
              const width = i === 0 ? "w-full" : i === 1 ? "w-3/4" : "w-1/2";
              const color = funnelColors[level];
              return (
                <div
                  key={level}
                  className={`${width} rounded-lg flex items-center justify-between px-3 py-2 transition-all`}
                  style={{
                    backgroundColor: active ? `${color}25` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: active ? color : "#6B7280" }}
                  >
                    {level}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: active ? color : "#6B7280" }}
                  >
                    {funnelLabels[level]}
                  </span>
                  {active && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {s.funnel.schwartz > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Schwartz nivel:</span>
              <span className="text-xs font-bold text-yellow-400">{s.funnel.schwartz}</span>
            </div>
          )}
          <p className="text-xs text-gray-400 leading-relaxed">{s.funnel.description}</p>
          {s.funnel.tags && s.funnel.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {s.funnel.tags.map((t) => (
                <Tag_ key={t} color={funnelColors[s.funnel.stage]}>{t}</Tag_>
              ))}
            </div>
          )}
        </div>
      }
    />
  );

  // 10. Content Pillar
  const pillarCard = (
    <DimensionCard
      index={1}
      icon={<Layers size={15} />}
      title="Pilar de Contenido"
      score={s.pillar.score}
      preview={
        s.pillar.breakdown[0] ? (
          <Tag_ color={PILLAR_COLORS[s.pillar.breakdown[0].pillar]}>
            {s.pillar.breakdown[0].pillar}
          </Tag_>
        ) : null
      }
      detail={
        <div className="space-y-3">
          {/* Stacked bar */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Distribución</p>
            <div className="w-full h-5 rounded-full overflow-hidden flex">
              {s.pillar.breakdown.map((p) => (
                <div
                  key={p.pillar}
                  title={`${p.pillar}: ${p.percentage}%`}
                  style={{
                    width: `${p.percentage}%`,
                    backgroundColor: PILLAR_COLORS[p.pillar] ?? "#6B7280",
                  }}
                />
              ))}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-2">
              {s.pillar.breakdown.map((p) => (
                <div key={p.pillar} className="flex items-center gap-1">
                  <div
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: PILLAR_COLORS[p.pillar] ?? "#6B7280" }}
                  />
                  <span className="text-xs text-gray-400">
                    {p.pillar} {p.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{s.pillar.description}</p>
        </div>
      }
    />
  );

  // 11. Sales Angle
  const salesCard = (
    <DimensionCard
      index={2}
      icon={<DollarSign size={15} />}
      title="Ángulo de Venta"
      score={s.sales_angle.score}
      preview={
        s.sales_angle.maslow ? (
          <Tag_ color="#7c3aed">{s.sales_angle.maslow}</Tag_>
        ) : null
      }
      detail={
        <div className="space-y-3">
          {/* Pain → Desire → Transformation flow */}
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { label: "Dolor", text: s.sales_angle.pain, color: "#EF4444" },
                { label: "Deseo", text: s.sales_angle.desire, color: "#7c3aed" },
                { label: "Transformación", text: s.sales_angle.transformation, color: "#22C55E" },
              ] as const
            ).map(({ label, text, color }) => (
              <div
                key={label}
                className="rounded-lg p-2.5 flex flex-col gap-1"
                style={{ backgroundColor: `${color}12`, border: `1px solid ${color}30` }}
              >
                <span className="text-xs font-semibold" style={{ color }}>
                  {label}
                </span>
                <span className="text-xs text-gray-300 leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
          {s.sales_angle.maslow && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Maslow:</span>
              <Tag_ color="#7c3aed">{s.sales_angle.maslow}</Tag_>
            </div>
          )}
          <p className="text-xs text-gray-400 leading-relaxed">{s.sales_angle.description}</p>
        </div>
      }
    />
  );

  // 12. Virality
  const viralityScore = s.virality.score;
  const viralColor = scoreColor(viralityScore);
  const viralCard = (
    <DimensionCard
      index={3}
      icon={<Share2 size={15} />}
      title="Viralidad"
      score={viralityScore}
      preview={<Tag_ color={viralColor}>{s.virality.emotion}</Tag_>}
      detail={
        <div className="space-y-3">
          {/* Big score */}
          <div className="flex items-center justify-center py-3">
            <span
              className="text-5xl font-black tabular-nums"
              style={{ color: viralColor }}
            >
              {viralityScore}
            </span>
            <span className="text-lg text-gray-500 ml-1">/10</span>
          </div>
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {s.virality.emotion && (
              <Tag_ color="#EC4899">{s.virality.emotion}</Tag_>
            )}
            {s.virality.pattern && (
              <Tag_ color="#A855F7">{s.virality.pattern}</Tag_>
            )}
            {s.virality.shareability && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ color: viralColor, backgroundColor: `${viralColor}20`, border: `1px solid ${viralColor}40` }}
              >
                Compartibilidad: {s.virality.shareability}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{s.virality.description}</p>
          {s.virality.tags && s.virality.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {s.virality.tags.map((t) => (
                <Tag_ key={t} color={viralColor}>{t}</Tag_>
              ))}
            </div>
          )}
          {s.virality.recommendation && (
            <div
              className="rounded-lg p-3"
              style={{ backgroundColor: `${viralColor}10`, border: `1px solid ${viralColor}25` }}
            >
              <p className="text-xs leading-relaxed" style={{ color: viralColor }}>
                <span className="font-semibold">Recomendación: </span>
                {s.virality.recommendation}
              </p>
            </div>
          )}
        </div>
      }
    />
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {funnelCard}
      {pillarCard}
      {salesCard}
      {viralCard}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RAW TEXT PARSING & RENDERING (fallback when all scores are 0)
// ═══════════════════════════════════════════════════════════════════════════

interface ParsedSection {
  id: string;
  label: string;
  lines: string[];
}

function parseRawAnalysis(rawText: string): ParsedSection[] {
  // Split by ━━━ SECTION_NAME ━━━ dividers
  const sectionRegex = /━+\s*([A-ZÁÉÍÓÚÑÜ]+(?:\s+[A-ZÁÉÍÓÚÑÜ]+)*)\s*━+/g;
  const parts: { name: string; startIndex: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = sectionRegex.exec(rawText)) !== null) {
    parts.push({ name: match[1].trim(), startIndex: match.index + match[0].length });
  }

  if (parts.length === 0) {
    // No sections found, return single section with all text
    return [{ id: "analisis", label: "ANÁLISIS", lines: rawText.split("\n").filter((l) => l.trim()) }];
  }

  const sections: ParsedSection[] = [];
  const knownSections: Record<string, string> = {
    ESTRUCTURA: "estructura_raw",
    COPY: "copy_raw",
    ESTRATEGIA: "estrategia_raw",
    "PRODUCCIÓN": "produccion_raw",
    PRODUCCION: "produccion_raw",
    VEREDICTO: "veredicto_raw",
    "VEREDICTO FINAL": "veredicto_raw",
  };

  for (let i = 0; i < parts.length; i++) {
    const start = parts[i].startIndex;
    const end = i + 1 < parts.length ? rawText.lastIndexOf("━", parts[i + 1].startIndex - 1) : rawText.length;
    const sectionText = rawText.slice(start, end).trim();
    const lines = sectionText.split("\n").filter((l) => l.trim());
    const name = parts[i].name;
    const id = knownSections[name] || name.toLowerCase().replace(/\s+/g, "_") + "_raw";

    sections.push({ id, label: name, lines });
  }

  return sections;
}

/** Render a single line with formatting */
function FormattedLine({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // Score pattern: "Score: X/10" or similar
  const scoreMatch = trimmed.match(/Score:\s*(\d+)\/10/i);
  if (scoreMatch) {
    const score = parseInt(scoreMatch[1], 10);
    const color = scoreColor(score);
    return (
      <div className="flex items-center gap-2 py-1">
        <span className="text-xs text-gray-400">{trimmed.replace(scoreMatch[0], "").trim()}</span>
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold tabular-nums"
          style={{ color, backgroundColor: `${color}18`, border: `1px solid ${color}40` }}
        >
          {scoreMatch[0]}
        </span>
      </div>
    );
  }

  // Emoji header lines (🎣 Hook, 📖 Desarrollo, etc.)
  const emojiHeaderMatch = trimmed.match(/^([\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u{1F900}-\u{1F9FF}])\s+(.+)/u);
  if (emojiHeaderMatch) {
    return (
      <p className="text-sm font-bold text-purple-400 mt-3 mb-1">
        {emojiHeaderMatch[1]} {renderBoldText(emojiHeaderMatch[2])}
      </p>
    );
  }

  // ✅ lines
  if (trimmed.startsWith("✅")) {
    return (
      <div className="flex items-start gap-2 py-0.5">
        <CheckCircle2 size={13} className="text-green-400 mt-0.5 shrink-0" />
        <span className="text-xs text-green-300 leading-relaxed">{renderBoldText(trimmed.slice(1).trim())}</span>
      </div>
    );
  }

  // ❌ lines
  if (trimmed.startsWith("❌")) {
    return (
      <div className="flex items-start gap-2 py-0.5">
        <XCircle size={13} className="text-red-400 mt-0.5 shrink-0" />
        <span className="text-xs text-red-300 leading-relaxed">{renderBoldText(trimmed.slice(1).trim())}</span>
      </div>
    );
  }

  // Lines starting with bullet points or dashes
  if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("→")) {
    return (
      <p className="text-xs text-gray-400 leading-relaxed pl-3 py-0.5">
        {trimmed.charAt(0)} {renderBoldText(trimmed.slice(1).trim())}
      </p>
    );
  }

  // Regular text
  return (
    <p className="text-xs text-gray-400 leading-relaxed py-0.5">
      {renderBoldText(trimmed)}
    </p>
  );
}

/** Render **bold** markdown within text */
function renderBoldText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} className="font-bold text-white">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/** Tab colors for raw sections */
const RAW_TAB_COLORS: Record<string, string> = {
  estructura_raw: "#3B82F6",
  copy_raw: "#7c3aed",
  estrategia_raw: "#22C55E",
  produccion_raw: "#A855F7",
  veredicto_raw: "#FFB800",
};

function RawAnalysisSection({ rawText }: { rawText: string }) {
  const sections = parseRawAnalysis(rawText);
  const [activeTab, setActiveTab] = useState(sections[0]?.id || "");

  const activeSection = sections.find((s) => s.id === activeTab);

  return (
    <>
      {/* Tab bar */}
      <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
        {sections.map((section) => {
          const isActive = activeTab === section.id;
          const color = RAW_TAB_COLORS[section.id] || "#6B7280";
          return (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className="relative px-4 py-3 text-xs font-bold tracking-widest transition-colors whitespace-nowrap"
              style={{ color: isActive ? color : "#6B7280" }}
            >
              {section.label}
              {isActive && (
                <motion.div
                  layoutId="raw-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: color }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="rounded-xl border border-white/[0.08] bg-[#1a1a1a] p-5 space-y-1"
          >
            {activeSection.lines.map((line, i) => (
              <FormattedLine key={i} text={line} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
interface StrategicAnalysisSectionProps {
  analysis: StrategicAnalysis;
  scores: Scores;
}

export default function StrategicAnalysisSection({
  analysis,
  scores,
}: StrategicAnalysisSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("estructura");

  // Detect if all structured dimension scores are 0 (no parsed data from Jarvis)
  const allScoresZero =
    analysis.structure.hook.score === 0 &&
    analysis.structure.development.score === 0 &&
    analysis.structure.cta.score === 0 &&
    analysis.structure.format.score === 0 &&
    analysis.copy.formula.score === 0 &&
    analysis.copy.power_words.score === 0 &&
    analysis.copy.mental_triggers.score === 0 &&
    analysis.copy.tone.score === 0 &&
    analysis.strategy.funnel.score === 0 &&
    analysis.strategy.pillar.score === 0 &&
    analysis.strategy.sales_angle.score === 0 &&
    analysis.strategy.virality.score === 0;

  const hasRawText = !!analysis.raw_text && analysis.raw_text.trim().length > 0;

  const TAB_CONTENT: Record<TabId, React.ReactNode> = {
    estructura: <StructureBlock s={analysis.structure} />,
    copy: <CopyBlock c={analysis.copy} />,
    estrategia: <StrategyBlock s={analysis.strategy} />,
  };

  return (
    <section id="strategic" className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <SectionHeader
        title="Análisis Estratégico"
        subtitle="12 dimensiones del contenido desglosadas"
        badge="12 dimensiones"
        icon={<BarChart2 size={18} />}
      />

      {allScoresZero && hasRawText ? (
        /* ── Fallback: show parsed raw_text with tabs when no structured data ── */
        <RawAnalysisSection rawText={analysis.raw_text!} />
      ) : (
        <>
          {/* ── Tab bar ── */}
          <div className="flex border-b border-white/10 mb-6">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-4 py-3 text-xs font-bold tracking-widest transition-colors"
                  style={{ color: isActive ? tab.color : "#6B7280" }}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: tab.color }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Tab content with slide transition ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {TAB_CONTENT[activeTab]}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </section>
  );
}
