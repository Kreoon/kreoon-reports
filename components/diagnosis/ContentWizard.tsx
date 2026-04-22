"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/report/shared/SectionHeader";
import type { ContentWizardInput, ContentReplica, ReplicaMode, ReplicaAngle } from "@/types/report";

// ── Constantes ────────────────────────────────────────────────────────────────

const MODES: { value: ReplicaMode; label: string; emoji: string; desc: string }[] = [
  { value: "brand", emoji: "🏷️", label: "Otra marca", desc: "Mismo producto y ángulo, adaptado a una marca (personal o comercial) nueva" },
  { value: "niche", emoji: "🎯", label: "Otro nicho", desc: "Mismo formato y gatillos pero trasladado a un nicho totalmente distinto" },
  { value: "angle", emoji: "🔀", label: "Otro ángulo", desc: "Mismo tema pero con ángulo contrarian/educativo/emocional — para A/B testing" },
  { value: "alex", emoji: "👑", label: "Voz Alexander Cast", desc: "Adapta el guión a la voz personal de Alexander (5 pilares: Dios, IA, Estrategia, Emprendimiento, Historia)" },
];

const ANGLES: { value: ReplicaAngle; label: string; emoji: string }[] = [
  { value: "contrarian", emoji: "🔥", label: "Contrarian" },
  { value: "mainstream", emoji: "📢", label: "Mainstream" },
  { value: "educativo", emoji: "📚", label: "Educativo" },
  { value: "emocional", emoji: "💗", label: "Emocional" },
  { value: "storytelling", emoji: "📖", label: "Storytelling" },
];

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

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContentWizard({ reportId, brandName, existingReplicas }: Props) {
  const [step, setStep] = useState<number>(existingReplicas?.length ? 4 : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [replicas, setReplicas] = useState<ContentReplica[]>(existingReplicas || []);
  const [activeTab, setActiveTab] = useState(0);

  const [form, setForm] = useState<ContentWizardInput>({
    mode: "brand",
    cta: "",
    objective: "alcance",
    platform: "instagram",
    tone: "educativo",
    variations: 2,
    brand_type: "personal",
  });

  const update = <K extends keyof ContentWizardInput>(field: K, value: ContentWizardInput[K]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const isStep1Valid = () => {
    const mode = form.mode || "brand";
    if (mode === "brand") return !!form.brand_name?.trim();
    if (mode === "niche") return !!form.new_niche?.trim();
    if (mode === "angle") return !!form.new_angle;
    if (mode === "alex") return true;
    return false;
  };

  const handleGenerate = async () => {
    if (!form.cta.trim()) {
      setError("El CTA es obligatorio");
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
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Error generando contenido");
    } finally {
      setLoading(false);
    }
  };

  // ═══ Step 0: Elegir modo ═══
  if (step === 0) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="card-premium p-6 space-y-6">
          <SectionHeader
            icon={<span className="text-lg">🎬</span>}
            title="¿Qué tipo de réplica quieres?"
            subtitle={`El guión se construirá a partir del análisis completo de ${brandName}`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => update("mode", m.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  form.mode === m.value
                    ? "border-kreoon bg-kreoon/10 text-white"
                    : "border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{m.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">{m.label}</div>
                    <div className="text-xs opacity-70 leading-snug">{m.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setStep(1)}
              disabled={!form.mode}
              className="px-6 py-2.5 rounded-full bg-kreoon text-white font-semibold hover:bg-kreoon/90 transition-colors disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ═══ Step 1: Campos contextuales según modo ═══
  if (step === 1) {
    const mode = form.mode || "brand";
    return (
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="card-premium p-6 space-y-6">
          <SectionHeader
            icon={<span className="text-lg">{MODES.find((m) => m.value === mode)?.emoji}</span>}
            title={MODES.find((m) => m.value === mode)?.label || ""}
            subtitle="Completa el contexto para personalizar los guiones"
          />

          {mode === "brand" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de marca</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["personal", "comercial"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => update("brand_type", t)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all capitalize ${
                        form.brand_type === t
                          ? "border-kreoon bg-kreoon/10 text-white"
                          : "border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-600"
                      }`}
                    >
                      {t === "personal" ? "👤 Personal" : "🏢 Comercial"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de la marca o persona *
                </label>
                <input
                  type="text"
                  value={form.brand_name || ""}
                  onChange={(e) => update("brand_name", e.target.value)}
                  placeholder={form.brand_type === "personal" ? "Ej: Alexander Cast, María González..." : "Ej: Nike, Kreoon, Tienda X..."}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-kreoon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Producto o servicio</label>
                <input
                  type="text"
                  value={form.product || ""}
                  onChange={(e) => update("product", e.target.value)}
                  placeholder="Ej: Consultoría en IA, zapatillas deportivas, curso de copy..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-kreoon"
                />
              </div>
            </div>
          )}

          {mode === "niche" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nuevo nicho *</label>
                <input
                  type="text"
                  value={form.new_niche || ""}
                  onChange={(e) => update("new_niche", e.target.value)}
                  placeholder="Ej: finanzas personales, fitness, cocina saludable..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-kreoon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Audiencia objetivo</label>
                <input
                  type="text"
                  value={form.target_audience || ""}
                  onChange={(e) => update("target_audience", e.target.value)}
                  placeholder="Ej: mamás millennials, emprendedores LATAM, estudiantes universitarios..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-kreoon"
                />
              </div>
            </div>
          )}

          {mode === "angle" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Ángulo nuevo *</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {ANGLES.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => update("new_angle", a.value)}
                      className={`p-3 rounded-xl border text-center text-sm font-medium transition-all ${
                        form.new_angle === a.value
                          ? "border-kreoon bg-kreoon/10 text-white"
                          : "border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-600"
                      }`}
                    >
                      <div className="text-lg">{a.emoji}</div>
                      <div className="text-xs mt-1">{a.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tema (opcional)</label>
                <input
                  type="text"
                  value={form.topic || ""}
                  onChange={(e) => update("topic", e.target.value)}
                  placeholder="Déjalo vacío para usar el tema del video original"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-kreoon"
                />
              </div>
            </div>
          )}

          {mode === "alex" && (
            <div className="bg-zinc-900 border border-kreoon/30 rounded-xl p-5 space-y-3">
              <p className="text-sm text-white font-medium">
                Se usará la voz de <span className="text-kreoon">Alexander Cast</span>:
              </p>
              <ul className="text-xs text-gray-400 space-y-1 pl-4 list-disc">
                <li>5 pilares: Dios (25%) · IA (25%) · Estrategia (20%) · Emprendimiento (20%) · Historia (10%)</li>
                <li>Estilo colombiano paisa, frases cortas, preguntas retóricas</li>
                <li>Tagline: "Dios. Estrategia. IA."</li>
                <li>Hook patterns: "Yo estaba quebrado y...", "Lo que nadie te dice...", "Le pedí a Claude que..."</li>
              </ul>
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Tema (opcional)</label>
                <input
                  type="text"
                  value={form.topic || ""}
                  onChange={(e) => update("topic", e.target.value)}
                  placeholder="Déjalo vacío para derivar del análisis del video"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-kreoon"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button onClick={() => setStep(0)} className="px-5 py-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700">
              ← Anterior
            </button>
            <button
              onClick={() => isStep1Valid() ? setStep(2) : setError("Completa los campos obligatorios (*)")}
              className="px-6 py-2.5 rounded-full bg-kreoon text-white font-semibold hover:bg-kreoon/90"
            >
              Siguiente →
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </section>
    );
  }

  // ═══ Step 2: Objetivo + Plataforma ═══
  if (step === 2) {
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
                      form.objective === obj.value ? "border-kreoon bg-kreoon/10 text-white" : "border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-600"
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
                      form.platform === p.value ? "border-kreoon bg-kreoon/10 text-white" : "border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-600"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700">
              ← Anterior
            </button>
            <button onClick={() => setStep(3)} className="px-6 py-2.5 rounded-full bg-kreoon text-white font-semibold hover:bg-kreoon/90">
              Siguiente →
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ═══ Step 3: Tono + Variaciones + CTA + Generar ═══
  if (step === 3) {
    const mode = form.mode || "brand";
    const modeLabel = MODES.find((m) => m.value === mode)?.label;
    const contextSummary =
      mode === "brand" ? `${form.brand_name}${form.product ? ` · ${form.product}` : ""}`
      : mode === "niche" ? `${form.new_niche}${form.target_audience ? ` · ${form.target_audience}` : ""}`
      : mode === "angle" ? `${form.new_angle}${form.topic ? ` · ${form.topic}` : ""}`
      : "Voz Alexander Cast";

    return (
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="card-premium p-6 space-y-6">
          <SectionHeader
            icon={<span className="text-lg">🎭</span>}
            title="Tono, CTA y Variaciones"
            subtitle="Último paso antes de generar"
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
                      form.tone === t.value ? "border-kreoon bg-kreoon/10 text-white" : "border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-600"
                    }`}
                  >
                    <span className="text-lg mr-2">{t.emoji}</span>
                    <span className="font-semibold text-sm">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CTA — Qué quieres que haga tu audiencia *
              </label>
              <input
                type="text"
                value={form.cta}
                onChange={(e) => update("cta", e.target.value)}
                placeholder='Ej: Agendar cita, comentar "QUIERO", visitar link en bio...'
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-kreoon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Variaciones</label>
              <div className="grid grid-cols-3 gap-3">
                {([1, 2, 3] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => update("variations", n)}
                    className={`p-3 rounded-xl border text-center text-sm font-medium transition-all ${
                      form.variations === n ? "border-kreoon bg-kreoon/10 text-white" : "border-zinc-700 bg-zinc-900 text-gray-400 hover:border-zinc-600"
                    }`}
                  >
                    {n} {n === 1 ? "guión" : "guiones"}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Resumen</p>
              <p className="text-sm text-gray-300">
                Modo: <span className="text-kreoon">{modeLabel}</span> · {contextSummary}
              </p>
              <p className="text-sm text-gray-300">
                {form.variations} {form.variations === 1 ? "guión" : "guiones"} ·{" "}
                {PLATFORMS.find((p) => p.value === form.platform)?.label} · {TONES.find((t) => t.value === form.tone)?.label} ·{" "}
                {OBJECTIVES.find((o) => o.value === form.objective)?.label}
              </p>
              <p className="text-sm text-gray-400">CTA: {form.cta || "..."}</p>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700">
              ← Anterior
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-kreoon text-white font-semibold hover:bg-kreoon/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

  // ═══ Step 4: Resultados ═══
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="card-premium p-6 space-y-6">
        <SectionHeader
          icon={<span className="text-lg">🎬</span>}
          title="Tus Guiones Listos"
          subtitle={`${replicas.length} ${replicas.length === 1 ? "variación" : "variaciones"} · ${MODES.find((m) => m.value === (form.mode || "brand"))?.label}`}
          badge={form.platform}
        />
        {replicas.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {replicas.map((r, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === i ? "bg-kreoon text-white" : "bg-zinc-800 text-gray-400 hover:text-white"
                }`}
              >
                V{r.version}: {r.title.slice(0, 25)}{r.title.length > 25 ? "..." : ""}
              </button>
            ))}
          </div>
        )}
        <AnimatePresence mode="wait">
          {replicas[activeTab] && <ReplicaCard key={activeTab} replica={replicas[activeTab]} />}
        </AnimatePresence>
        <div className="flex justify-center pt-4">
          <button
            onClick={() => { setStep(0); setReplicas([]); }}
            className="px-5 py-2.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 text-sm"
          >
            Generar otra réplica
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
  const fullCaption = replica.caption + "\n\n" + replica.hashtags.map((h) => `#${h}`).join(" ");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      <div className="bg-gradient-to-r from-kreoon/10 to-transparent border border-kreoon/20 rounded-xl p-4">
        <p className="text-xs text-kreoon font-semibold uppercase tracking-wider mb-1">Hook</p>
        <p className="text-white text-lg font-medium">{replica.hook}</p>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-300">Guión</p>
          <CopyBtn text={fullScript} label="Copiar guión" copied={copiedField === "script"} onClick={() => copyText(fullScript, "script")} />
        </div>
        <div className="space-y-2">
          {replica.script.map((line, i) => (
            <div key={i} className={`bg-zinc-900 border-l-2 ${SECTION_COLORS[line.section] || "border-l-zinc-600"} rounded-r-lg p-3`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-kreoon bg-kreoon/10 px-1.5 py-0.5 rounded">{line.time}</span>
                <span className="text-xs text-gray-500 capitalize">{line.section}</span>
              </div>
              <p className="text-sm text-white">{line.text}</p>
              {line.direction && <p className="text-xs text-gray-500 mt-1 italic">{line.direction}</p>}
              {line.on_screen_text && <p className="text-xs text-yellow-400/70 mt-1">[Texto en pantalla: {line.on_screen_text}]</p>}
            </div>
          ))}
        </div>
      </div>
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

function CopyBtn({ text, label, copied, onClick }: { text: string; label: string; copied: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
      {copied ? "Copiado" : label}
    </button>
  );
}
