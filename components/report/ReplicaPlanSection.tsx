"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Play,
  Sparkles,
  Target,
  Globe,
  BookOpen,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  User,
  Compass,
  Map,
  Flag,
  Star,
  Frown,
} from "lucide-react";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type {
  Replicas,
  WizardConfig,
  ScriptLine,
  StoryBrand,
  CreatorBrief,
  RepurposingItem,
} from "@/types/report";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ReplicaPlanSectionProps {
  replicas: Replicas | null;
  wizard: WizardConfig | null;
  onOpenTeleprompter: (version: string, script: ScriptLine[]) => void;
  repurposing?: RepurposingItem[];
  teleprompterScript?: string | null;
}

type TabKey = "v1" | "v2" | "v3";

const TABS: { key: TabKey; label: string }[] = [
  { key: "v1", label: "V1 Fiel" },
  { key: "v2", label: "V2 Mejorada" },
  { key: "v3", label: "V3 Kreoon UGC" },
];

// ── CopyButton (inline, no shared file dependency) ───────────────────────────

function CopyButton({
  text,
  label = "Copiar",
  fullWidth = false,
  variant = "ghost",
}: {
  text: string;
  label?: string;
  fullWidth?: boolean;
  variant?: "ghost" | "brand";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback silent */
    }
  };

  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-all duration-200 px-3 py-1.5";
  const variants = {
    ghost: "bg-white/5 border border-white/10 text-gray-300 hover:border-white/20 hover:text-white",
    brand:
      "bg-kreoon text-white hover:bg-kreoon-dark active:scale-95 shadow-sm",
  };

  return (
    <button
      onClick={handleCopy}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
    >
      {copied ? (
        <>
          <Check size={13} className="text-green-500" />
          ¡Copiado!
        </>
      ) : (
        <>
          <Copy size={13} />
          {label}
        </>
      )}
    </button>
  );
}

// ── WizardConfigCard ──────────────────────────────────────────────────────────

function WizardConfigCard({ wizard }: { wizard: WizardConfig }) {
  const objectiveLabels: Record<string, string> = {
    alcance:   "Alcance masivo",
    leads:     "Generación de leads",
    venta:     "Conversión / Venta",
    autoridad: "Autoridad de marca",
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      <div className="flex items-center gap-1.5 text-gray-400">
        <BookOpen size={13} className="text-kreoon" />
        <span className="font-medium text-white">{wizard.topic}</span>
      </div>
      <span className="text-gray-600 hidden sm:inline">·</span>
      <div className="flex items-center gap-1.5 text-gray-400">
        <Target size={13} className="text-kreoon" />
        <span>{objectiveLabels[wizard.objective] ?? wizard.objective}</span>
      </div>
      <span className="text-gray-600 hidden sm:inline">·</span>
      <div className="flex items-center gap-1.5 text-gray-400">
        <Globe size={13} className="text-kreoon" />
        <span className="capitalize">{wizard.platform}</span>
      </div>
    </div>
  );
}

// ── HashtagPills ──────────────────────────────────────────────────────────────

function parseHashtags(raw: string): string[] {
  return raw
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`));
}

function hashtagColor(tag: string): string {
  // Rough classification by tag length as proxy for audience size
  const len = tag.length;
  if (len <= 8)  return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  if (len <= 14) return "bg-green-500/15 text-green-300 border-green-500/30";
  return              "bg-purple-500/15 text-purple-300 border-purple-500/30";
}

function HashtagsBlock({ hashtags }: { hashtags: string }) {
  const tags = parseHashtags(hashtags);

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Hashtags</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span
            key={i}
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${hashtagColor(tag)}`}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-3 items-center text-xs text-gray-400 flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
          Grande (masivo)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
          Medio
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
          Nicho
        </span>
      </div>
      <CopyButton text={hashtags} label="Copiar Todo" />
    </div>
  );
}

// ── ProductionNotesGrid ───────────────────────────────────────────────────────

function ProductionNotesGrid({ notes }: { notes: string }) {
  // Split notes on newlines or semicolons into cards
  const items = notes
    .split(/[\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Notas de producción</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((note, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 leading-relaxed"
          >
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── StoryBrandVisual ──────────────────────────────────────────────────────────

const SB_NODES: {
  key: keyof StoryBrand;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { key: "hero",    label: "Héroe",  icon: <User size={14} />,    color: "bg-purple-500/15 border-purple-500/30 text-purple-300" },
  { key: "guide",   label: "Guía",   icon: <Compass size={14} />, color: "bg-blue-500/15 border-blue-500/30 text-blue-300" },
  { key: "plan",    label: "Plan",   icon: <Map size={14} />,     color: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300" },
  { key: "cta",     label: "CTA",    icon: <Flag size={14} />,    color: "bg-purple-500/15 border-purple-500/30 text-purple-300" },
  { key: "success", label: "Éxito",  icon: <Star size={14} />,    color: "bg-green-500/15 border-green-500/30 text-green-300" },
  { key: "failure", label: "Riesgo", icon: <Frown size={14} />,   color: "bg-red-500/15 border-red-500/30 text-red-300" },
];

function StoryBrandVisual({ sb }: { sb: StoryBrand }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
        <Layers size={13} className="text-kreoon" />
        Marco StoryBrand
      </p>

      {/* Linear nodes 1-4 */}
      <div className="flex items-stretch gap-1 flex-wrap sm:flex-nowrap">
        {SB_NODES.slice(0, 4).map((node, i) => (
          <div key={node.key} className="flex items-center gap-1 flex-1 min-w-0">
            <div
              className={`flex-1 rounded-lg border px-2 py-2 text-xs ${node.color} space-y-1 min-w-0`}
            >
              <div className="flex items-center gap-1 font-semibold">
                {node.icon}
                {node.label}
              </div>
              <p className="leading-snug line-clamp-3 text-[11px] opacity-80">{sb[node.key]}</p>
            </div>
            {i < 3 && <ArrowRight size={14} className="text-gray-500 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Diverging nodes 5 (success ↗) and 6 (failure ↘) */}
      <div className="flex gap-3">
        {SB_NODES.slice(4).map((node) => (
          <div
            key={node.key}
            className={`flex-1 rounded-lg border px-2 py-2 text-xs ${node.color} space-y-1`}
          >
            <div className="flex items-center gap-1 font-semibold">
              {node.icon}
              {node.label}
              {node.key === "success" && <TrendingUp size={11} />}
              {node.key === "failure" && <AlertCircle size={11} />}
            </div>
            <p className="leading-snug line-clamp-3 text-[11px] opacity-80">{sb[node.key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CreatorBriefCard ──────────────────────────────────────────────────────────

function CreatorBriefCard({ brief }: { brief: CreatorBrief }) {
  return (
    <div className="bg-[#1a1a1a] text-white rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <User size={14} className="text-kreoon" />
        <h4 className="font-bold text-sm uppercase tracking-wide text-kreoon">Creator Brief</h4>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {[
          { label: "Marca",      value: brief.brand },
          { label: "Producto",   value: brief.product },
          { label: "Plataforma", value: brief.platform },
          { label: "Duración",   value: brief.duration },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/5 rounded-lg px-2 py-1.5">
            <p className="text-gray-400 mb-0.5">{label}</p>
            <p className="text-white font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Objetivo */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Objetivo</p>
        <p className="text-sm text-gray-200">{brief.objective}</p>
      </div>

      {/* Key messages */}
      {brief.key_messages.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Mensajes clave</p>
          <ul className="space-y-0.5">
            {brief.key_messages.map((m, i) => (
              <li key={i} className="text-xs text-gray-300 flex gap-1.5">
                <span className="text-kreoon mt-0.5">›</span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Do / Don't */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-green-400 uppercase tracking-wide mb-1">Sí hacer</p>
          <ul className="space-y-0.5">
            {brief.dos.map((d, i) => (
              <li key={i} className="text-xs text-gray-300 flex gap-1.5">
                <Check size={11} className="text-green-400 mt-0.5 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs text-red-400 uppercase tracking-wide mb-1">No hacer</p>
          <ul className="space-y-0.5">
            {brief.donts.map((d, i) => (
              <li key={i} className="text-xs text-gray-300 flex gap-1.5">
                <span className="text-red-400 mt-0.5 text-xs">✕</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Deliverables */}
      {brief.deliverables.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Entregables</p>
          <div className="flex flex-wrap gap-1.5">
            {brief.deliverables.map((d, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 bg-kreoon/20 text-kreoon rounded-full"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── TransmediaTable ───────────────────────────────────────────────────────────

function TransmediaTable({ items }: { items: RepurposingItem[] }) {
  if (!items.length) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
        <Globe size={13} className="text-kreoon" />
        Distribución Transmedia
      </p>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="text-left text-xs font-semibold text-gray-400 px-4 py-2.5 uppercase tracking-wide">Plataforma</th>
              <th className="text-left text-xs font-semibold text-gray-400 px-4 py-2.5 uppercase tracking-wide">Formato</th>
              <th className="text-left text-xs font-semibold text-gray-400 px-4 py-2.5 uppercase tracking-wide hidden sm:table-cell">Adaptación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-2.5 font-medium text-white capitalize">{item.platform}</td>
                <td className="px-4 py-2.5 text-gray-400">{item.format}</td>
                <td className="px-4 py-2.5 text-gray-400 hidden sm:table-cell">{item.adaptation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab content ───────────────────────────────────────────────────────────────

function V1TabContent({
  replica,
  onOpenTeleprompter,
}: {
  replica: Replicas["faithful"];
  onOpenTeleprompter: () => void;
}) {
  return (
    <div className="space-y-6 pt-5">
      {/* Hook block */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Hook</p>
        <div className="bg-gray-900 rounded-xl p-4 space-y-2">
          <p className="text-white font-bold text-lg leading-snug">{replica.hook}</p>
          {replica.script[0] && (
            <p className="text-gray-400 text-xs font-mono">{replica.script[0].time} — {replica.script[0].direction}</p>
          )}
          <CopyButton text={replica.hook} label="Copiar Hook" />
        </div>
      </div>

      {/* Caption block */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Caption</p>
        <div className="bg-purple-500/5 border-l-4 border-kreoon rounded-xl p-4 space-y-3">
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{replica.caption}</p>
          <CopyButton text={replica.caption} label="Copiar Caption" fullWidth variant="brand" />
        </div>
      </div>

      {/* Hashtags block */}
      <HashtagsBlock hashtags={replica.hashtags} />

      {/* Production notes */}
      <ProductionNotesGrid notes={replica.production_notes} />

      {/* Teleprompter button */}
      <button
        onClick={onOpenTeleprompter}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors"
      >
        <Play size={14} />
        MODO TELEPROMPTER
      </button>
    </div>
  );
}

function V2TabContent({
  replica,
  onOpenTeleprompter,
}: {
  replica: Replicas["improved"];
  onOpenTeleprompter: () => void;
}) {
  return (
    <div className="space-y-6 pt-5">
      {/* Improvements banner */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-green-400 font-bold text-sm uppercase tracking-wide">
          <Sparkles size={14} />
          MEJORAS APLICADAS
        </div>

        {replica.improvements.length > 0 && (
          <div>
            <p className="text-xs text-green-500 font-semibold mb-1">Mejoras generales</p>
            <ul className="space-y-0.5">
              {replica.improvements.map((item, i) => (
                <li key={i} className="text-xs text-green-400 flex gap-1.5">
                  <Check size={11} className="mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {replica.triggers_added.length > 0 && (
          <div>
            <p className="text-xs text-green-500 font-semibold mb-1">Triggers añadidos</p>
            <div className="flex flex-wrap gap-1">
              {replica.triggers_added.map((t, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-green-500/15 text-green-300 rounded-full border border-green-500/30">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {replica.neurocopy_changes.length > 0 && (
          <div>
            <p className="text-xs text-green-500 font-semibold mb-1">Cambios neurocopy</p>
            <ul className="space-y-0.5">
              {replica.neurocopy_changes.map((c, i) => (
                <li key={i} className="text-xs text-green-400 flex gap-1.5">
                  <ArrowRight size={11} className="mt-0.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Hook block */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Hook</p>
        <div className="bg-gray-900 rounded-xl p-4 space-y-2">
          <p className="text-white font-bold text-lg leading-snug">{replica.hook}</p>
          {replica.script[0] && (
            <p className="text-gray-400 text-xs font-mono">{replica.script[0].time} — {replica.script[0].direction}</p>
          )}
          <CopyButton text={replica.hook} label="Copiar Hook" />
        </div>
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Caption</p>
        <div className="bg-purple-500/5 border-l-4 border-kreoon rounded-xl p-4 space-y-3">
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{replica.caption}</p>
          <CopyButton text={replica.caption} label="Copiar Caption" fullWidth variant="brand" />
        </div>
      </div>

      {/* Hashtags */}
      <HashtagsBlock hashtags={replica.hashtags} />

      {/* Production notes */}
      <ProductionNotesGrid notes={replica.production_notes} />

      {/* Teleprompter */}
      <button
        onClick={onOpenTeleprompter}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors"
      >
        <Play size={14} />
        MODO TELEPROMPTER
      </button>
    </div>
  );
}

function V3TabContent({
  replica,
  onOpenTeleprompter,
}: {
  replica: Replicas["kreoon"];
  onOpenTeleprompter: () => void;
}) {
  return (
    <div className="space-y-6 pt-5">
      {/* Hook block */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Hook</p>
        <div className="bg-gray-900 rounded-xl p-4 space-y-2">
          <p className="text-white font-bold text-lg leading-snug">{replica.hook}</p>
          {replica.script[0] && (
            <p className="text-gray-400 text-xs font-mono">{replica.script[0].time} — {replica.script[0].direction}</p>
          )}
          <CopyButton text={replica.hook} label="Copiar Hook" />
        </div>
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Caption</p>
        <div className="bg-purple-500/5 border-l-4 border-kreoon rounded-xl p-4 space-y-3">
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{replica.caption}</p>
          <CopyButton text={replica.caption} label="Copiar Caption" fullWidth variant="brand" />
        </div>
      </div>

      {/* Hashtags */}
      <HashtagsBlock hashtags={replica.hashtags} />

      {/* Production notes */}
      <ProductionNotesGrid notes={replica.production_notes} />

      {/* StoryBrand visual */}
      <StoryBrandVisual sb={replica.storybrand} />

      {/* Creator brief */}
      <CreatorBriefCard brief={replica.creator_brief} />

      {/* Teleprompter */}
      <button
        onClick={onOpenTeleprompter}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors"
      >
        <Play size={14} />
        MODO TELEPROMPTER
      </button>
    </div>
  );
}

// ── Parse raw text into ScriptLine[] ──────────────────────────────────────────

function parseRawTextToScript(raw: string): ScriptLine[] {
  return raw
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

// ── Parse timestamped script text into ScriptLine[] ──────────────────────────

function parseTimestampedScript(scriptText: string): ScriptLine[] {
  const lines = scriptText.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const result: ScriptLine[] = [];
  for (const line of lines) {
    // Match patterns like [0:00-0:03] "text" or [0:00] text or **[0:00-0:03]** text
    const match = line.match(/\*?\*?\[([^\]]+)\]\*?\*?\s*["""']?(.+?)["""']?\s*$/);
    if (match) {
      result.push({
        time: match[1],
        text: match[2].replace(/^\*\*\s*/, "").replace(/\s*\*\*$/, ""),
        direction: "",
        section: "development" as const,
      });
    } else if (line.length > 0) {
      result.push({
        time: "",
        text: line.replace(/^[-•]\s*/, ""),
        direction: "",
        section: "development" as const,
      });
    }
  }
  return result;
}

// ── Parse raw replicas from concatenated text ────────────────────────────────

interface ParsedVersion {
  hook: string;
  scriptText: string;
  scriptLines: ScriptLine[];
  caption: string;
  hashtags: string;
  productionNotes: string;
  brief: string;
}

interface ParsedReplicas {
  v1: ParsedVersion;
  v2: ParsedVersion;
  v3: ParsedVersion;
}

function extractSection(block: string, startPattern: RegExp, endPattern?: RegExp): string {
  const startMatch = block.match(startPattern);
  if (!startMatch) return "";
  const startIdx = block.indexOf(startMatch[0]) + startMatch[0].length;
  let endIdx = block.length;
  if (endPattern) {
    const rest = block.slice(startIdx);
    const endMatch = rest.match(endPattern);
    if (endMatch) {
      endIdx = startIdx + rest.indexOf(endMatch[0]);
    }
  }
  return block.slice(startIdx, endIdx).trim();
}

function parseRawReplicas(rawText: string): ParsedReplicas | null {
  // Split on version headers
  const versionSplits = rawText.split(/## 📋\s*\*\*VERSIÓN\s*/);
  if (versionSplits.length < 4) return null; // Need at least 3 versions + preamble

  const sectionHeaderPattern = /###\s*(?:🎣|📝|🎬|👤|📊|🏷️|#️⃣|💡|📋)/;

  function parseVersionBlock(block: string): ParsedVersion {
    // Extract hook section: between HOOK header and next section
    let hook = "";
    let scriptText = "";
    const hookSection = extractSection(
      block,
      /###\s*🎣\s*\*\*HOOK/i,
      /###\s*(?:📝|🎬|👤|📊|🏷️|#️⃣|💡|📋)/
    );
    if (hookSection) {
      // Hook text is typically the first line(s) before code block
      const hookLines = hookSection.split("\n");
      const hookTextLines: string[] = [];
      let inCodeBlock = false;
      const scriptLines: string[] = [];

      for (const line of hookLines) {
        if (line.trim().startsWith("```")) {
          inCodeBlock = !inCodeBlock;
          continue;
        }
        if (inCodeBlock) {
          scriptLines.push(line);
        } else if (!inCodeBlock && scriptLines.length === 0) {
          // Before code block = hook text
          const cleaned = line.replace(/\*\*/g, "").trim();
          if (cleaned && !cleaned.startsWith("###") && !cleaned.match(/^Y GUIÓN/i) && !cleaned.match(/^GUIÓN/i)) {
            hookTextLines.push(cleaned);
          }
        }
      }
      hook = hookTextLines.join("\n").trim();
      scriptText = scriptLines.join("\n").trim();
    }

    // Extract caption section
    let caption = "";
    let hashtags = "";
    const captionSection = extractSection(
      block,
      /###\s*📝\s*\*\*CAPTION/i,
      /###\s*(?:🎬|👤|📊|🏷️|💡|📋)/
    );
    if (captionSection) {
      const captionLines: string[] = [];
      const hashtagLines: string[] = [];
      for (const line of captionSection.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.match(/^#\w/) || trimmed.match(/^#[A-Za-z]/)) {
          hashtagLines.push(trimmed);
        } else {
          const cleaned = trimmed.replace(/\*\*/g, "").replace(/^```.*$/, "").trim();
          if (cleaned) {
            captionLines.push(cleaned);
          }
        }
      }
      caption = captionLines.join("\n").trim();
      hashtags = hashtagLines.join(" ").trim();
    }

    // Extract production notes
    const productionNotes = extractSection(
      block,
      /###\s*🎬\s*\*\*NOTAS DE PRODUCCI[OÓ]N/i,
      /###\s*(?:👤|📊|🏷️|💡|📋)/
    );

    // Extract brief
    const brief = extractSection(
      block,
      /###\s*👤\s*\*\*BRIEF/i,
      /###\s*(?:📊|🏷️|💡|📋)/
    );

    // Clean up production notes - remove markdown formatting
    const cleanNotes = productionNotes
      .split("\n")
      .map((l) => l.replace(/\*\*/g, "").replace(/^[-•]\s*/, "").trim())
      .filter(Boolean)
      .join("\n");

    // Clean up brief
    const cleanBrief = brief
      .split("\n")
      .map((l) => l.replace(/\*\*/g, "").trim())
      .filter(Boolean)
      .join("\n");

    return {
      hook,
      scriptText,
      scriptLines: scriptText ? parseTimestampedScript(scriptText) : [],
      caption,
      hashtags,
      productionNotes: cleanNotes,
      brief: cleanBrief,
    };
  }

  return {
    v1: parseVersionBlock(versionSplits[1] || ""),
    v2: parseVersionBlock(versionSplits[2] || ""),
    v3: parseVersionBlock(versionSplits[3] || ""),
  };
}

// ── Parsed raw version tab content ───────────────────────────────────────────

function ParsedVersionTabContent({
  version,
  showBrief = false,
  onOpenTeleprompter,
}: {
  version: ParsedVersion;
  showBrief?: boolean;
  onOpenTeleprompter: () => void;
}) {
  return (
    <div className="space-y-6 pt-5">
      {/* Hook block */}
      {version.hook && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Hook</p>
          <div className="bg-gray-900 rounded-xl p-4 space-y-2">
            <p className="text-white font-bold text-lg leading-snug">{version.hook}</p>
            <CopyButton text={version.hook} label="Copiar Hook" />
          </div>
        </div>
      )}

      {/* Script block */}
      {version.scriptText && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Guión</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xs leading-relaxed space-y-1 overflow-x-auto">
            {version.scriptLines.length > 0
              ? version.scriptLines.map((line, i) => (
                  <div key={i} className="flex gap-3">
                    {line.time && (
                      <span className="text-kreoon font-semibold whitespace-nowrap min-w-[70px]">
                        [{line.time}]
                      </span>
                    )}
                    <span className="text-gray-300">{line.text}</span>
                  </div>
                ))
              : <pre className="text-gray-300 whitespace-pre-wrap">{version.scriptText}</pre>
            }
          </div>
        </div>
      )}

      {/* Caption block */}
      {version.caption && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Caption</p>
          <div className="bg-purple-500/5 border-l-4 border-kreoon rounded-xl p-4 space-y-3">
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{version.caption}</p>
            <CopyButton text={version.caption} label="Copiar Caption" fullWidth variant="brand" />
          </div>
        </div>
      )}

      {/* Hashtags */}
      {version.hashtags && <HashtagsBlock hashtags={version.hashtags} />}

      {/* Production notes */}
      {version.productionNotes && <ProductionNotesGrid notes={version.productionNotes} />}

      {/* Brief */}
      {showBrief && version.brief && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Brief para Creator UGC</p>
          <div className="bg-[#1a1a1a] text-white rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <User size={14} className="text-kreoon" />
              <h4 className="font-bold text-sm uppercase tracking-wide text-kreoon">Creator Brief</h4>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{version.brief}</p>
          </div>
        </div>
      )}

      {/* Teleprompter button */}
      <button
        onClick={onOpenTeleprompter}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors"
      >
        <Play size={14} />
        MODO TELEPROMPTER
      </button>
    </div>
  );
}

// ── Detect fallback mode ──────────────────────────────────────────────────────

function isRawCaptionMode(replicas: Replicas): boolean {
  const faithfulHasContent = (replicas.faithful.caption?.length ?? 0) > 500;
  const improvedEmpty = !replicas.improved.caption || replicas.improved.caption.trim() === "";
  return faithfulHasContent && improvedEmpty;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ReplicaPlanSection({
  replicas,
  wizard,
  onOpenTeleprompter,
  repurposing = [],
  teleprompterScript,
}: ReplicaPlanSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("v1");

  // ── Empty state ──
  if (replicas === null) {
    return (
      <section id="replica" className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <SectionHeader
          title="Plan de Réplica"
          subtitle="Versiones listas para grabar"
          badge="Réplica"
          icon={<Copy size={18} />}
        />
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center gap-3 text-center">
          <AlertCircle size={32} className="text-gray-500" />
          <p className="text-gray-400 font-medium">
            Este reporte es solo análisis (Opción A)
          </p>
          <p className="text-gray-500 text-sm max-w-sm">
            El Plan de Réplica está disponible en los reportes con Wizard activado.
          </p>
        </div>
      </section>
    );
  }

  // ── Repurposing rows passed from parent (PublishStrategy.repurposing) ──
  const transmediaItems: RepurposingItem[] = repurposing;

  // ── Fallback: all content dumped into faithful.caption ──
  const rawMode = isRawCaptionMode(replicas);

  if (rawMode) {
    const rawCaption = replicas.faithful.caption;
    const parsed = parseRawReplicas(rawCaption);

    // If parsing fails, show raw text as before
    if (!parsed) {
      const fallbackScript = teleprompterScript
        ? parseRawTextToScript(teleprompterScript)
        : parseRawTextToScript(rawCaption);

      return (
        <section id="replica" className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-14 space-y-6">
          <SectionHeader
            title="Plan de Réplica"
            subtitle="Versiones listas para grabar"
            badge="Réplica"
            icon={<Copy size={18} />}
          />

          {wizard && <WizardConfigCard wizard={wizard} />}

          <div className="relative">
            <div className="flex bg-white/5 rounded-xl p-1 gap-1">
              <div className="relative flex-1 text-sm font-semibold py-2 px-3 rounded-lg z-10 text-white bg-white/10 text-center">
                Réplicas
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Contenido de Réplica</p>
              <div className="bg-purple-500/5 border-l-4 border-kreoon rounded-xl p-4 space-y-3">
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{rawCaption}</p>
                <CopyButton text={rawCaption} label="Copiar Todo" fullWidth variant="brand" />
              </div>
            </div>
            <button
              onClick={() => onOpenTeleprompter("Réplica", fallbackScript)}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors"
            >
              <Play size={14} />
              MODO TELEPROMPTER
            </button>
          </div>

          {transmediaItems.length > 0 && <TransmediaTable items={transmediaItems} />}
        </section>
      );
    }

    // Successfully parsed 3 versions - use the 3-tab UI
    const parsedTabContent: Record<TabKey, React.ReactNode> = {
      v1: (
        <ParsedVersionTabContent
          version={parsed.v1}
          onOpenTeleprompter={() =>
            onOpenTeleprompter(
              "V1 Fiel",
              parsed.v1.scriptLines.length > 0
                ? parsed.v1.scriptLines
                : parseRawTextToScript(parsed.v1.scriptText || parsed.v1.caption)
            )
          }
        />
      ),
      v2: (
        <ParsedVersionTabContent
          version={parsed.v2}
          onOpenTeleprompter={() =>
            onOpenTeleprompter(
              "V2 Mejorada",
              parsed.v2.scriptLines.length > 0
                ? parsed.v2.scriptLines
                : parseRawTextToScript(parsed.v2.scriptText || parsed.v2.caption)
            )
          }
        />
      ),
      v3: (
        <ParsedVersionTabContent
          version={parsed.v3}
          showBrief
          onOpenTeleprompter={() =>
            onOpenTeleprompter(
              "V3 Kreoon UGC",
              parsed.v3.scriptLines.length > 0
                ? parsed.v3.scriptLines
                : parseRawTextToScript(parsed.v3.scriptText || parsed.v3.caption)
            )
          }
        />
      ),
    };

    const parsedTabIndex = TABS.findIndex((t) => t.key === activeTab);

    return (
      <section id="replica" className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-14 space-y-6">
        <SectionHeader
          title="Plan de Réplica"
          subtitle="Versiones listas para grabar — elige tu nivel de intervención"
          badge="3 Versiones"
          icon={<Copy size={18} />}
        />

        {wizard && <WizardConfigCard wizard={wizard} />}

        {/* Tab bar */}
        <div className="relative">
          <div className="flex bg-white/5 rounded-xl p-1 gap-1">
            <motion.div
              className="absolute top-1 bottom-1 rounded-lg bg-white/10"
              layoutId="tab-indicator-raw"
              style={{
                width: `calc((100% - 8px) / ${TABS.length})`,
                left: `calc(4px + ${parsedTabIndex} * ((100% - 8px) / ${TABS.length}))`,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />

            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex-1 text-sm font-semibold py-2 px-3 rounded-lg z-10 transition-colors duration-200 ${
                  activeTab === tab.key ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {parsedTabContent[activeTab]}
          </motion.div>
        </AnimatePresence>

        {transmediaItems.length > 0 && <TransmediaTable items={transmediaItems} />}
      </section>
    );
  }

  // ── Tab content map ──
  const tabContent: Record<TabKey, React.ReactNode> = {
    v1: (
      <V1TabContent
        replica={replicas.faithful}
        onOpenTeleprompter={() => onOpenTeleprompter("V1 Fiel", replicas.faithful.script)}
      />
    ),
    v2: (
      <V2TabContent
        replica={replicas.improved}
        onOpenTeleprompter={() => onOpenTeleprompter("V2 Mejorada", replicas.improved.script)}
      />
    ),
    v3: (
      <V3TabContent
        replica={replicas.kreoon}
        onOpenTeleprompter={() => onOpenTeleprompter("V3 Kreoon UGC", replicas.kreoon.script)}
      />
    ),
  };

  const tabIndex = TABS.findIndex((t) => t.key === activeTab);

  return (
    <section id="replica" className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-14 space-y-6">
      <SectionHeader
        title="Plan de Réplica"
        subtitle="Versiones listas para grabar — elige tu nivel de intervención"
        badge="3 Versiones"
        icon={<Copy size={18} />}
      />

      {/* Wizard config */}
      {wizard && <WizardConfigCard wizard={wizard} />}

      {/* Tab bar */}
      <div className="relative">
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          {/* Sliding indicator */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-lg bg-white/10"
            layoutId="tab-indicator"
            style={{
              width: `calc((100% - 8px) / ${TABS.length})`,
              left: `calc(4px + ${tabIndex} * ((100% - 8px) / ${TABS.length}))`,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />

          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex-1 text-sm font-semibold py-2 px-3 rounded-lg z-10 transition-colors duration-200 ${
                activeTab === tab.key ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>

      {/* Transmedia table — always visible */}
      {transmediaItems.length > 0 && <TransmediaTable items={transmediaItems} />}
    </section>
  );
}
