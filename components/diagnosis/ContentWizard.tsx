"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type { ContentWizardInput, ContentReplica } from "@/types/report";

// ── Wizard Form ──────────────────────────────────────────────────────────────

const OBJECTIVES = [
  { value: "alcance", label: "Alcance", desc: "Llegar a más personas" },
  { value: "leads", label: "Leads", desc: "Captar contactos" },
  { value: "venta", label: "Venta", desc: "Convertir a clientes" },
  { value: "autoridad", label: "Autoridad", desc: "Posicionarme como experto" },
] as const;

const PLATFORMS = [
  { value: "instagram", label: "Instagram Reels" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube Shorts" },
] as const;

const TONES = [
  { value: "educativo", label: "Educativo", emoji: "📚" },
  { value: "entretenido", label: "Entretenido", emoji: "🎭" },
  { value: "inspiracional", label: "Inspiracional", emoji: "✨" },
  { value: "directo", label: "Directo", emoji: "🎯" },
] as const;

interface Props {
  reportId: string;
  brandName: string;
  existingReplicas?: ContentReplica[];
}

export default function ContentWizard({ reportId, brandName, existingReplicas }: Props) {
  const [wizardStep, setWizardStep] = useState(existingReplicas?.length ? 3 : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [replicas, setReplicas] = useState<ContentReplica[]>(existingReplicas || []);
  const [activeTab, setActiveTab] = useState(0);

  const [form, setForm] = useState<ContentWizardInput>({
    topic: "",
    cta: "",
    objective: "alcance",
    platform: "instagram",
    tone: "educativo",
    variations: 2,
  });

  const update = (field: keyof ContentWizardInput, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleGenerate = async () => {
    if (!form.topic.trim() || !form.cta.trim()) {
      setError("Completa el tema y el CTA antes de generar.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/reports/${reportId}/generate-content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }

      const data = await res.json();
      setReplicas(data.replicas);
      setActiveTab(0);
      setWizardStep(3);
    } catch (err: any) {
      setError(err.message || "Error generando contenido");
    } finally {
      setLoading(false);
    }
  };

  // ── Wizard Step 0: Topic + CTA ──
  if (wizardStep === 0) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="card-premium p-6 space-y-6">
          <SectionHeader
            icon={<span className="text-lg">🎬</span>}
            title="Crea tu Contenido"
            subtitle={`Genera guiones listos para grabar para ${brandName}`}
          />

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tema o producto que quieres promover
              </label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => update("topic", e.target.value)}
                placeholder="Ej: Lanzamiento de nueva colección, servicio de consultoría, tips de skincare..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-kreoon transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CTA — Qué quieres que haga tu audiencia
              </label>
              <input
                type="text"
                value={form.cta}
                onChange={(e) => update("cta", e.target.value)}
                placeholder="Ej: Agendar una cita, visitar el link en bio, comentar 'QUIERO'..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-kreoon transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => form.topic.trim() && form.cta.trim() ? setWizardStep(1) : setError("Completa ambos campos")}
              className="px-6 py-2.5 rounded-full bg-kreoon text-white font-semibold hover:bg-kreoon/90 transition-colors"
            >
              Siguiente →
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </section>
    );
  }

  // ── Wizard Step 1: Objective + Platform ──
  if (wizardStep === 1) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="card-premium p-6 space-y-6">
          <SectionHeader
            icon={<span className="text-lg">🎯</span>}
            title="Objetivo y Plataforma"
            subtitle="Define para qué y dónde publicas"
          />

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Objetivo</label>
              <div className="grid grid-cols-2 gap-3">
                {OBJECTIVES.map((obj) => (
                  <button
                    key={obj.value}
                    onClick={() => update("objective", obj.value)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      form.objective === obj.value
                        ? "border-kreoon bg-kreoon/10 text-white"
                        : "border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-600"
                    }`}
                  >
                    <div className="font-semibold text-sm">{obj.label}</div>
                    <div className="text-xs mt-0.5 opacity-70">{obj.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Plataforma</label>
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => update("platform", p.value)}
                    className={`p-3 rounded-xl border text-center text-sm font-medium transition-all ${
                      form.platform === p.value
                        ? "border-kreoon bg-kreoon/10 text-white"
                        : "border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-600"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setWizardStep(0)} className="px-5 py-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">
              ← Anterior
            </button>
            <button onClick={() => setWizardStep(2)} className="px-6 py-2.5 rounded-full bg-kreoon text-white font-semibold hover:bg-kreoon/90 transition-colors">
              Siguiente →
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── Wizard Step 2: Tone + Variations + Generate ──
  if (wizardStep === 2) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="card-premium p-6 space-y-6">
          <SectionHeader
            icon={<span className="text-lg">🎭</span>}
            title="Tono y Variaciones"
            subtitle="Personaliza el estilo de tu contenido"
          />

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Tono</label>
              <div className="grid grid-cols-2 gap-3">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => update("tone", t.value)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      form.tone === t.value
                        ? "border-kreoon bg-kreoon/10 text-white"
                        : "border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-600"
                    }`}
                  >
                    <span className="text-lg mr-2">{t.emoji}</span>
                    <span className="font-semibold text-sm">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Variaciones</label>
              <div className="grid grid-cols-3 gap-3">
                {([1, 2, 3] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => update("variations", n)}
                    className={`p-3 rounded-xl border text-center text-sm font-medium transition-all ${
                      form.variations === n
                        ? "border-kreoon bg-kreoon/10 text-white"
                        : "border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-600"
                    }`}
                  >
                    {n} {n === 1 ? "guión" : "guiones"}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Resumen</p>
              <p className="text-sm text-gray-300">
                <span className="text-white font-medium">{form.variations} {form.variations === 1 ? "guión" : "guiones"}</span>
                {" "}sobre <span className="text-kreoon">{form.topic || "..."}</span>
                {" "}para <span className="text-white">{PLATFORMS.find(p => p.value === form.platform)?.label}</span>
                {" "}· {TONES.find(t => t.value === form.tone)?.label} · {OBJECTIVES.find(o => o.value === form.objective)?.label}
              </p>
              <p className="text-sm text-gray-400">CTA: {form.cta || "..."}</p>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-between">
            <button onClick={() => setWizardStep(1)} className="px-5 py-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">
              ← Anterior
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-kreoon text-white font-semibold hover:bg-kreoon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Generando...
                </>
              ) : (
                "Generar guiones"
              )}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── Step 3: Results ──
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-6">
        <SectionHeader
          icon={<span className="text-lg">🎬</span>}
          title="Tus Guiones Listos"
          subtitle={`${replicas.length} ${replicas.length === 1 ? "variación" : "variaciones"} para ${brandName}`}
          badge={form.platform}
        />

        {/* Tabs */}
        {replicas.length > 1 && (
          <div className="flex gap-2">
            {replicas.map((r, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === i
                    ? "bg-kreoon text-white"
                    : "bg-zinc-800 text-gray-400 hover:text-white"
                }`}
              >
                V{r.version}: {r.title.slice(0, 25)}{r.title.length > 25 ? "..." : ""}
              </button>
            ))}
          </div>
        )}

        {/* Active replica */}
        <AnimatePresence mode="wait">
          {replicas[activeTab] && (
            <ReplicaCard key={activeTab} replica={replicas[activeTab]} />
          )}
        </AnimatePresence>

        {/* New generation button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => { setWizardStep(0); setReplicas([]); }}
            className="px-5 py-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors text-sm"
          >
            Generar otro contenido
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Replica Card ─────────────────────────────────────────────────────────────

function ReplicaCard({ replica }: { replica: ContentReplica }) {
  const [copiedField, setCopiedField] = useState("");

  const copyText = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2000);
    } catch { /* silent */ }
  };

  const SECTION_COLORS: Record<string, string> = {
    hook: "border-l-red-500",
    development: "border-l-blue-500",
    cta: "border-l-green-500",
    transition: "border-l-yellow-500",
  };

  const fullScript = replica.script.map((l) => `[${l.time}] ${l.text}`).join("\n");
  const fullCaption = replica.caption + "\n\n" + replica.hashtags.map(h => `#${h}`).join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5"
    >
      {/* Hook highlight */}
      <div className="bg-gradient-to-r from-kreoon/10 to-transparent border border-kreoon/20 rounded-xl p-4">
        <p className="text-xs text-kreoon font-semibold uppercase tracking-wider mb-1">Hook</p>
        <p className="text-white text-lg font-medium">{replica.hook}</p>
      </div>

      {/* Script timeline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-300">Guión</p>
          <CopyBtn text={fullScript} label="Copiar guión" copied={copiedField === "script"} onClick={() => copyText(fullScript, "script")} />
        </div>
        <div className="space-y-2">
          {replica.script.map((line, i) => (
            <div
              key={i}
              className={`bg-zinc-900 border-l-2 ${SECTION_COLORS[line.section] || "border-l-zinc-600"} rounded-r-lg p-3`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-kreoon bg-kreoon/10 px-1.5 py-0.5 rounded">{line.time}</span>
                <span className="text-xs text-gray-500 capitalize">{line.section}</span>
              </div>
              <p className="text-sm text-white">{line.text}</p>
              {line.direction && <p className="text-xs text-gray-500 mt-1 italic">{line.direction}</p>}
              {line.on_screen_text && (
                <p className="text-xs text-yellow-400/70 mt-1">[Texto en pantalla: {line.on_screen_text}]</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Caption */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-300">Caption + Hashtags</p>
          <CopyBtn text={fullCaption} label="Copiar" copied={copiedField === "caption"} onClick={() => copyText(fullCaption, "caption")} />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-gray-300 whitespace-pre-line">{replica.caption}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {replica.hashtags.map((h, i) => (
              <span key={i} className="text-xs text-kreoon bg-kreoon/10 px-2 py-0.5 rounded-full">#{h}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Production + Strategy row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Producción</p>
          <p className="text-sm text-gray-300">{replica.production_notes}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">Publicación</p>
          <p className="text-sm text-white font-medium">{replica.best_time}</p>
          {replica.repurposing.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500">Repurposing:</p>
              {replica.repurposing.map((r, i) => (
                <p key={i} className="text-xs text-gray-400">• {r}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Copy button helper ───────────────────────────────────────────────────────

function CopyBtn({ text, label, copied, onClick }: { text: string; label: string; copied: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
    >
      {copied ? "Copiado" : label}
    </button>
  );
}
