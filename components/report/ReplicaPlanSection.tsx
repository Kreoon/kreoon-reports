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
  variant?: "ghost" | "orange";
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
    ghost: "bg-white border border-gray-200 text-gray-700 hover:border-gray-400 hover:text-gray-900",
    orange:
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
    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      <div className="flex items-center gap-1.5 text-gray-600">
        <BookOpen size={13} className="text-kreoon" />
        <span className="font-medium text-gray-800">{wizard.topic}</span>
      </div>
      <span className="text-gray-300 hidden sm:inline">·</span>
      <div className="flex items-center gap-1.5 text-gray-600">
        <Target size={13} className="text-kreoon" />
        <span>{objectiveLabels[wizard.objective] ?? wizard.objective}</span>
      </div>
      <span className="text-gray-300 hidden sm:inline">·</span>
      <div className="flex items-center gap-1.5 text-gray-600">
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
  if (len <= 8)  return "bg-blue-100 text-blue-700 border-blue-200";
  if (len <= 14) return "bg-green-100 text-green-700 border-green-200";
  return              "bg-orange-100 text-orange-700 border-orange-200";
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
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
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
            className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-700 leading-relaxed"
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
  { key: "hero",    label: "Héroe",  icon: <User size={14} />,    color: "bg-purple-100 border-purple-300 text-purple-700" },
  { key: "guide",   label: "Guía",   icon: <Compass size={14} />, color: "bg-blue-100 border-blue-300 text-blue-700" },
  { key: "plan",    label: "Plan",   icon: <Map size={14} />,     color: "bg-cyan-100 border-cyan-300 text-cyan-700" },
  { key: "cta",     label: "CTA",    icon: <Flag size={14} />,    color: "bg-orange-100 border-orange-300 text-orange-700" },
  { key: "success", label: "Éxito",  icon: <Star size={14} />,    color: "bg-green-100 border-green-300 text-green-700" },
  { key: "failure", label: "Riesgo", icon: <Frown size={14} />,   color: "bg-red-100 border-red-300 text-red-700" },
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
            {i < 3 && <ArrowRight size={14} className="text-gray-300 shrink-0" />}
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
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5 uppercase tracking-wide">Plataforma</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5 uppercase tracking-wide">Formato</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5 uppercase tracking-wide hidden sm:table-cell">Adaptación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5 font-medium text-gray-800 capitalize">{item.platform}</td>
                <td className="px-4 py-2.5 text-gray-600">{item.format}</td>
                <td className="px-4 py-2.5 text-gray-500 hidden sm:table-cell">{item.adaptation}</td>
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
        <div className="bg-[#FFF8F0] border-l-4 border-kreoon rounded-xl p-4 space-y-3">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{replica.caption}</p>
          <CopyButton text={replica.caption} label="Copiar Caption" fullWidth variant="orange" />
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
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-green-700 font-bold text-sm uppercase tracking-wide">
          <Sparkles size={14} />
          MEJORAS APLICADAS
        </div>

        {replica.improvements.length > 0 && (
          <div>
            <p className="text-xs text-green-600 font-semibold mb-1">Mejoras generales</p>
            <ul className="space-y-0.5">
              {replica.improvements.map((item, i) => (
                <li key={i} className="text-xs text-green-700 flex gap-1.5">
                  <Check size={11} className="mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {replica.triggers_added.length > 0 && (
          <div>
            <p className="text-xs text-green-600 font-semibold mb-1">Triggers añadidos</p>
            <div className="flex flex-wrap gap-1">
              {replica.triggers_added.map((t, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full border border-green-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {replica.neurocopy_changes.length > 0 && (
          <div>
            <p className="text-xs text-green-600 font-semibold mb-1">Cambios neurocopy</p>
            <ul className="space-y-0.5">
              {replica.neurocopy_changes.map((c, i) => (
                <li key={i} className="text-xs text-green-700 flex gap-1.5">
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
        <div className="bg-[#FFF8F0] border-l-4 border-kreoon rounded-xl p-4 space-y-3">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{replica.caption}</p>
          <CopyButton text={replica.caption} label="Copiar Caption" fullWidth variant="orange" />
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
        <div className="bg-[#FFF8F0] border-l-4 border-kreoon rounded-xl p-4 space-y-3">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{replica.caption}</p>
          <CopyButton text={replica.caption} label="Copiar Caption" fullWidth variant="orange" />
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

// ── Main component ────────────────────────────────────────────────────────────

export default function ReplicaPlanSection({
  replicas,
  wizard,
  onOpenTeleprompter,
  repurposing = [],
}: ReplicaPlanSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("v1");

  // ── Empty state ──
  if (replicas === null) {
    return (
      <section id="replica" className="w-full max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <SectionHeader
          title="Plan de Réplica"
          subtitle="Versiones listas para grabar"
          badge="Réplica"
          icon={<Copy size={18} />}
        />
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 flex flex-col items-center gap-3 text-center">
          <AlertCircle size={32} className="text-gray-300" />
          <p className="text-gray-500 font-medium">
            Este reporte es solo análisis (Opción A)
          </p>
          <p className="text-gray-400 text-sm max-w-sm">
            El Plan de Réplica está disponible en los reportes con Wizard activado.
          </p>
        </div>
      </section>
    );
  }

  // ── Repurposing rows passed from parent (PublishStrategy.repurposing) ──
  const transmediaItems: RepurposingItem[] = repurposing;

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
    <section id="replica" className="w-full max-w-5xl mx-auto px-4 py-10 sm:py-14 space-y-6">
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
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {/* Sliding indicator */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm"
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
                activeTab === tab.key ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
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
