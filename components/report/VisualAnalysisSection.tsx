"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Video,
  Mic,
  Sun,
  Scissors,
  MonitorPlay,
  LayoutTemplate,
  Eye,
} from "lucide-react";
import SectionHeader from "./shared/SectionHeader";
import { GeminiAnalysis } from "@/types/report";

// ─── helpers ────────────────────────────────────────────────────────────────

function emotionColor(emotion: string): string {
  const e = emotion.toLowerCase();
  if (e.includes("calm") || e.includes("tranquil") || e.includes("calm")) return "bg-blue-500";
  if (e.includes("joy") || e.includes("alegr") || e.includes("happy") || e.includes("feliz")) return "bg-amber-400";
  if (e.includes("inspir")) return "bg-purple-500";
  if (e.includes("urgent") || e.includes("urgent") || e.includes("tensi") || e.includes("fear") || e.includes("miedo")) return "bg-red-500";
  return "bg-gray-400";
}

function emotionBg(emotion: string): string {
  const e = emotion.toLowerCase();
  if (e.includes("calm") || e.includes("tranquil")) return "bg-blue-500/10 border-blue-500/30";
  if (e.includes("joy") || e.includes("alegr") || e.includes("happy") || e.includes("feliz")) return "bg-amber-400/10 border-amber-400/30";
  if (e.includes("inspir")) return "bg-purple-500/10 border-purple-500/30";
  if (e.includes("urgent") || e.includes("tensi") || e.includes("fear") || e.includes("miedo")) return "bg-red-500/10 border-red-500/30";
  return "bg-gray-400/10 border-gray-400/30";
}

function energyBarColor(energy: number): string {
  if (energy <= 3) return "bg-blue-500";
  if (energy <= 6) return "bg-amber-400";
  return "bg-red-500";
}

function sectionPillColor(index: number, total: number): string {
  const pct = index / Math.max(total - 1, 1);
  if (pct < 0.33) return "bg-blue-500/20 text-blue-400";
  if (pct < 0.66) return "bg-amber-500/20 text-amber-400";
  return "bg-red-500/20 text-red-400";
}

// Parse simple "0:00 text" lines from transcription string
function parseTranscriptionLines(raw: string): { timestamp: string; text: string }[] {
  if (!raw) return [];
  const lines = raw.split("\n").filter((l) => l.trim());
  return lines.map((line) => {
    const match = line.match(/^(\[?[\d:]+\]?)\s+(.+)/);
    if (match) {
      return { timestamp: match[1].replace(/[\[\]]/g, ""), text: match[2] };
    }
    return { timestamp: "", text: line };
  });
}

// ─── Transcription Block ────────────────────────────────────────────────────

function TranscriptionBlock({ transcription, tone }: { transcription: string; tone?: string }) {
  const [open, setOpen] = useState(true); // open on desktop via state; mobile handled via CSS
  const lines = parseTranscriptionLines(transcription);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-kreoon" />
          <span className="text-sm font-semibold text-gray-200">Transcripción</span>
          {lines.length > 0 && (
            <span className="text-xs text-gray-400">{lines.length} líneas</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="transcription-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="max-h-80 overflow-y-auto px-4 py-3 space-y-1.5
                scrollbar-thin scrollbar-thumb-gray-600
                scrollbar-track-transparent"
              style={{ scrollbarWidth: "thin" }}
            >
              {lines.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Sin transcripción disponible.</p>
              ) : (
                lines.map((line, i) => (
                  <div key={i} className="flex gap-2 items-start text-sm leading-relaxed">
                    {line.timestamp && (
                      <span className="flex-shrink-0 font-mono text-xs text-kreoon mt-0.5 w-10">
                        {line.timestamp}
                      </span>
                    )}
                    <span className="text-gray-300">{line.text}</span>
                  </div>
                ))
              )}
            </div>

            {tone && (
              <div className="px-4 py-2 border-t border-white/10 bg-white/[0.03] flex items-center gap-2">
                <span className="text-xs text-gray-400">Tono detectado:</span>
                <span className="text-xs font-medium text-kreoon bg-kreoon/10 px-2 py-0.5 rounded-full">
                  {tone}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Scene Card ─────────────────────────────────────────────────────────────

function SceneCard({
  scene,
  index,
  total,
}: {
  scene: GeminiAnalysis["scenes"][number];
  index: number;
  total: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={`relative flex-shrink-0 w-60 rounded-xl border p-3.5 bg-white/[0.03] shadow-sm
        ${emotionBg(scene.emotion)}`}
    >
      {/* timestamp pill */}
      <span
        className={`inline-block text-xs font-mono font-semibold px-2 py-0.5 rounded-full mb-2 ${sectionPillColor(index, total)}`}
      >
        {scene.time_start} – {scene.time_end}
      </span>

      {/* camera type */}
      <p className="text-xs font-medium text-gray-400 mb-1">{scene.camera}</p>

      {/* description */}
      <p className="text-sm text-gray-200 leading-snug mb-2 line-clamp-3">
        {scene.action}
      </p>

      {/* text on screen */}
      {scene.text_on_screen && (
        <div className="flex items-start gap-1 mb-2">
          <span className="text-xs bg-white/10 text-gray-400 px-1.5 py-0.5 rounded font-mono leading-tight max-w-full truncate">
            "{scene.text_on_screen}"
          </span>
        </div>
      )}

      {/* emotion dot + label */}
      <div className="flex items-center gap-1.5 mt-auto">
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${emotionColor(scene.emotion)}`} />
        <span className="text-xs text-gray-400 capitalize">{scene.emotion}</span>
        <span className="ml-auto text-xs font-semibold text-gray-400">⚡{scene.emotional_energy}/10</span>
      </div>
    </motion.div>
  );
}

// ─── Scenes Timeline ─────────────────────────────────────────────────────────

function ScenesTimeline({ scenes }: { scenes: GeminiAnalysis["scenes"] }) {
  return (
    <>
      {/* Desktop: horizontal scroll */}
      <div className="hidden md:block">
        <div className="relative">
          {/* connector line */}
          <div className="absolute top-[52px] left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 via-amber-400 to-red-500 z-0" />
          <div className="overflow-x-auto pb-3 -mx-1">
            <div className="flex gap-4 px-1 pt-2 pb-1" style={{ minWidth: "max-content" }}>
              {scenes.map((scene, i) => (
                <SceneCard key={i} scene={scene} index={i} total={scenes.length} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: vertical list */}
      <div className="md:hidden relative">
        <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-amber-400 to-red-500" />
        <div className="space-y-3 pl-8">
          {scenes.map((scene, i) => (
            <div key={i} className="relative">
              {/* dot on line */}
              <span
                className={`absolute -left-5 top-4 w-3 h-3 rounded-full border-2 border-gray-900 ${emotionColor(scene.emotion)}`}
              />
              <SceneCard scene={scene} index={i} total={scenes.length} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Emotional Energy Chart ──────────────────────────────────────────────────

function EmotionalEnergyChart({ scenes }: { scenes: GeminiAnalysis["scenes"] }) {
  const CHART_H = 80;

  return (
    <div className="rounded-xl border border-white/10 p-4 bg-white/[0.03]">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Curva de energía emocional
      </p>
      <div className="overflow-x-auto">
        <div
          className="flex items-end gap-1.5"
          style={{ minWidth: scenes.length * 36, height: CHART_H + 24 }}
        >
          {scenes.map((scene, i) => {
            const pct = (scene.emotional_energy / 10) * 100;
            const barH = Math.round((scene.emotional_energy / 10) * CHART_H);
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-[28px]">
                <div
                  className="relative group w-full rounded-t-sm cursor-default"
                  style={{ height: CHART_H }}
                >
                  {/* bar */}
                  <motion.div
                    className={`absolute bottom-0 w-full rounded-t-sm ${energyBarColor(scene.emotional_energy)}`}
                    initial={{ height: 0 }}
                    whileInView={{ height: barH }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
                  />
                  {/* tooltip */}
                  <div
                    className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100
                      transition-opacity bg-gray-900 text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap z-10 pointer-events-none"
                  >
                    {scene.emotional_energy}/10 · {scene.emotion}
                  </div>
                </div>
                <span className="text-[9px] font-mono text-gray-400 truncate w-full text-center leading-none">
                  {scene.time_start}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* legend */}
      <div className="flex gap-3 mt-2 flex-wrap">
        {[
          { color: "bg-blue-500", label: "Bajo (1-3)" },
          { color: "bg-amber-400", label: "Medio (4-6)" },
          { color: "bg-red-500", label: "Alto (7-10)" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-sm ${item.color}`} />
            <span className="text-xs text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Production Specs Grid ──────────────────────────────────────────────────

const PROD_ICONS: Record<string, React.ReactNode> = {
  lighting: <Sun className="w-4 h-4" />,
  audio: <Mic className="w-4 h-4" />,
  quality: <Eye className="w-4 h-4" />,
  editing: <Scissors className="w-4 h-4" />,
  cuts_per_minute: <Video className="w-4 h-4" />,
  aspect_ratio: <LayoutTemplate className="w-4 h-4" />,
};

function QualityDots({ value, max = 10 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5 mt-1 flex-wrap">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < value ? "bg-kreoon" : "bg-gray-700"}`}
        />
      ))}
    </div>
  );
}

function ProductionSpecsGrid({ production }: { production: GeminiAnalysis["production"] }) {
  const cards = [
    { key: "lighting", label: "Iluminación", value: production.lighting },
    { key: "audio", label: "Audio", value: production.audio },
    { key: "quality", label: "Calidad", value: production.quality, isNumber: true },
    { key: "editing", label: "Edición", value: production.editing },
    { key: "cuts_per_minute", label: "Cortes/min", value: production.cuts_per_minute },
    { key: "aspect_ratio", label: "Aspect ratio", value: production.aspect_ratio },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 text-gray-400">
            {PROD_ICONS[card.key]}
            <span className="text-xs font-medium text-gray-400">{card.label}</span>
          </div>
          {card.key === "quality" ? (
            <>
              <span className="text-sm font-bold text-white">
                {production.quality}
                <span className="text-xs font-normal text-gray-400">/10</span>
              </span>
              <QualityDots value={production.quality} />
            </>
          ) : (
            <span className="text-sm font-semibold text-white break-words">
              {String(card.value)}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Emotion cleaning helpers ────────────────────────────────────────────────

const EMOTION_LABEL_MAP: Record<string, string> = {
  "conversacional": "Conversacional",
  "de anticipación": "Anticipación",
  "de anticipacion": "Anticipación",
  "conversacional, explicativo": "Explicativo",
  "explicativo": "Explicativo",
};

function cleanEmotion(raw: string): string {
  // Strip trailing punctuation, parentheses, extra whitespace
  let cleaned = raw.replace(/[\)\(]+/g, "").replace(/[.,;:!?]+$/, "").trim();
  // Normalize to lowercase for lookup
  const key = cleaned.toLowerCase();
  if (EMOTION_LABEL_MAP[key]) return EMOTION_LABEL_MAP[key];
  // Capitalize first letter as fallback
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function dedupeConsecutiveEmotions(
  emotions: { timestamp: string; emotion: string }[]
): { timestamp: string; emotion: string }[] {
  if (emotions.length === 0) return [];
  const result: { timestamp: string; emotion: string }[] = [];
  let consecutiveCount = 1;
  let prev = cleanEmotion(emotions[0].emotion);

  result.push({ timestamp: emotions[0].timestamp, emotion: prev });

  for (let i = 1; i < emotions.length; i++) {
    const current = cleanEmotion(emotions[i].emotion);
    if (current === prev) {
      consecutiveCount++;
      // If same emotion appears 3+ times consecutively, skip
      if (consecutiveCount >= 3) continue;
    } else {
      consecutiveCount = 1;
    }
    prev = current;
    result.push({ timestamp: emotions[i].timestamp, emotion: current });
  }
  return result;
}

function allEmotionsSame(emotions: { timestamp: string; emotion: string }[]): string | null {
  if (emotions.length === 0) return null;
  const first = cleanEmotion(emotions[0].emotion);
  const allSame = emotions.every((e) => cleanEmotion(e.emotion) === first);
  return allSame ? first : null;
}

// ─── Production specs cleaning helpers ──────────────────────────────────────

const SPEC_LABEL_MAP: Record<string, string> = {
  plano: "Plano",
  angulo: "Ángulo",
  movimiento: "Movimiento",
  iluminacion: "Iluminación",
  audio: "Audio",
  aspecto: "Aspecto",
  calidad: "Calidad",
  duracion: "Duración",
};

function cleanSpecLabel(key: string): string {
  const normalized = key.replace(/_/g, " ").toLowerCase();
  return SPEC_LABEL_MAP[normalized] ?? key.replace(/_/g, " ").charAt(0).toUpperCase() + key.replace(/_/g, " ").slice(1);
}

function cleanSpecValue(value: string): string {
  let v = value;
  // Strip label prefix bleeding into value (e.g. "de cámara:** Frontal...")
  v = v.replace(/^(?:de\s+\w+:\s*\*?\*?\s*|:\s*\*?\*?\s*)/i, "");
  // Strip all remaining ** markdown artifacts anywhere
  v = v.replace(/\*\*/g, "");
  // Strip leading single * with optional space
  v = v.replace(/^\*\s*/, "");
  // Strip leading colon with optional space
  v = v.replace(/^:\s*/, "");
  return v.trim();
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface VisualAnalysisSectionProps {
  gemini: GeminiAnalysis;
  geminiProductionSpecs?: Record<string, string>;
  geminiEmotions?: { timestamp: string; emotion: string }[];
  aspectRatio?: string;
  videoQuality?: string;
}

export default function VisualAnalysisSection({ gemini, geminiProductionSpecs, geminiEmotions, aspectRatio, videoQuality }: VisualAnalysisSectionProps) {
  const hasScenes = gemini.scenes && gemini.scenes.length > 0;

  // Try to extract tone from full_analysis as a best-effort hint
  const toneMatch = gemini.full_analysis?.match(/tono[:\s]+([^\n,.]+)/i);
  const tone = toneMatch ? toneMatch[1].trim() : undefined;

  return (
    <section id="visual" className="w-full max-w-4xl mx-auto px-4 space-y-8 scroll-mt-20">
      <SectionHeader
        id="visual-header"
        icon={<MonitorPlay className="w-5 h-5" />}
        title="Análisis Visual"
        subtitle="Lo que Gemini vio en el video: escenas, transcripción y producción"
        badge="IA Visual"
      />

      {(() => {
        const transcriptionText = gemini.transcription || gemini.full_analysis;
        const hasTranscription = !!transcriptionText;
        const hasProductionData = gemini.production && (
          gemini.production.lighting ||
          gemini.production.audio ||
          gemini.production.editing ||
          gemini.production.aspect_ratio ||
          gemini.production.quality > 0 ||
          gemini.production.cuts_per_minute > 0
        );

        if (!hasScenes && !hasTranscription) {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-gray-700 bg-white/[0.03]"
            >
              <MonitorPlay className="w-10 h-10 text-gray-600 mb-3" />
              <p className="text-base font-medium text-gray-500">
                Análisis visual no disponible
              </p>
              <p className="text-sm text-gray-600 mt-1 max-w-xs">
                No se encontraron escenas detectadas por Gemini para este contenido.
              </p>
            </motion.div>
          );
        }

        return (
          <>
            {/* 1. Transcription — show if transcription or full_analysis available */}
            {hasTranscription && (
              <div className="space-y-2">
                <TranscriptionBlock transcription={transcriptionText} tone={tone} />
              </div>
            )}

            {/* 2. Scenes Timeline — only if structured scenes exist */}
            {hasScenes && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-kreoon inline-block" />
                  Timeline de escenas
                  <span className="text-xs font-normal normal-case text-gray-400">
                    ({gemini.scenes.length} escenas)
                  </span>
                </h3>
                <ScenesTimeline scenes={gemini.scenes} />
              </div>
            )}

            {/* 3. Emotional Energy Chart — only if structured scenes exist */}
            {hasScenes && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-kreoon inline-block" />
                  Energía emocional por escena
                </h3>
                <EmotionalEnergyChart scenes={gemini.scenes} />
              </div>
            )}

            {/* 4. Production Specs — only if production has non-empty values */}
            {hasProductionData && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-kreoon inline-block" />
                  Especificaciones de producción
                </h3>
                <ProductionSpecsGrid production={gemini.production} />
              </div>
            )}

            {/* 5. Info pills: aspect ratio + video quality */}
            {(aspectRatio || videoQuality) && (
              <div className="flex flex-wrap gap-2">
                {aspectRatio && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-white/5 border-white/10 text-gray-300">
                    <LayoutTemplate className="w-3 h-3 text-purple-400" />
                    {aspectRatio}
                  </span>
                )}
                {videoQuality && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-white/5 border-white/10 text-gray-300">
                    <Eye className="w-3 h-3 text-purple-400" />
                    {videoQuality}
                  </span>
                )}
              </div>
            )}

            {/* 6. Gemini Production Specs (desglosado) — extra key-value grid */}
            {geminiProductionSpecs && Object.keys(geminiProductionSpecs).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-kreoon inline-block" />
                  Detalles de producción (Gemini)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(geminiProductionSpecs).map(([key, value], i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex flex-col gap-1"
                    >
                      <span className="text-xs font-medium text-gray-400">{cleanSpecLabel(key)}</span>
                      <span className="text-sm font-semibold text-white break-words">{cleanSpecValue(value)}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Gemini Emotions timeline */}
            {geminiEmotions && geminiEmotions.length > 0 && (() => {
              const predominant = allEmotionsSame(geminiEmotions);
              const deduped = predominant ? [] : dedupeConsecutiveEmotions(geminiEmotions);

              return (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-kreoon inline-block" />
                    Timeline de emociones (Gemini)
                  </h3>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                    {predominant ? (
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${emotionColor(predominant)}`} />
                        <span className="text-sm text-gray-300">
                          Tono predominante: <span className="font-semibold text-white">{predominant}</span>
                        </span>
                      </div>
                    ) : (
                      deduped.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-400 w-12 flex-shrink-0">{item.timestamp}</span>
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${emotionColor(item.emotion)}`} />
                          <span className="text-sm text-gray-300">{item.emotion}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}
          </>
        );
      })()}
    </section>
  );
}
