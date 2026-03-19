"use client";

import { useState, Component, type ReactNode } from "react";
import type { ReportData } from "@/types/report";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

// ── Error Boundary ──
class ErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function SectionError({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center min-h-[40vh] px-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center text-zinc-400">
        <p className="text-sm">
          Sección &quot;{name}&quot; no disponible
        </p>
      </div>
    </div>
  );
}

// ── Lazy imports ──
const DiagnosisHero = dynamic(() => import("@/components/diagnosis/DiagnosisHero"), { ssr: false });
const SocialPresence = dynamic(() => import("@/components/diagnosis/SocialPresence"), { ssr: false });
const ContentAudit = dynamic(() => import("@/components/diagnosis/ContentAudit"), { ssr: false });
const StrategicDiagnosis = dynamic(() => import("@/components/diagnosis/StrategicDiagnosis"), { ssr: false });
const CompetitorAnalysis = dynamic(() => import("@/components/diagnosis/CompetitorAnalysis"), { ssr: false });
const Opportunities = dynamic(() => import("@/components/diagnosis/Opportunities"), { ssr: false });
const ServiceProposal = dynamic(() => import("@/components/diagnosis/ServiceProposal"), { ssr: false });
const DiagnosisFooter = dynamic(() => import("@/components/diagnosis/DiagnosisFooter"), { ssr: false });
const WhatsAppFloat = dynamic(() => import("@/components/report/WhatsAppFloat"), { ssr: false });

// ── Step definitions ──
const STEPS = [
  { id: 1, label: "Tu Marca", icon: "🎯" },
  { id: 2, label: "Diagnóstico", icon: "📊" },
  { id: 3, label: "Competencia", icon: "⚔️" },
  { id: 4, label: "Oportunidades", icon: "💡" },
  { id: 5, label: "Plan de Acción", icon: "🚀" },
];

// ── Step navigation ──
function StepNav({ current, total, onStep }: { current: number; total: number; onStep: (n: number) => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-1">
          {STEPS.slice(0, total).map((step) => (
            <button
              key={step.id}
              onClick={() => onStep(step.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                step.id === current
                  ? "bg-kreoon text-white"
                  : step.id < current
                  ? "bg-kreoon/20 text-kreoon"
                  : "bg-zinc-800/60 text-gray-500"
              }`}
            >
              <span>{step.icon}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-kreoon rounded-full"
            animate={{ width: `${(current / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

function StepButtons({ current, total, onPrev, onNext }: { current: number; total: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center justify-between max-w-4xl mx-auto px-4 py-6">
      <button
        onClick={onPrev}
        disabled={current <= 1}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
          current <= 1
            ? "opacity-0 pointer-events-none"
            : "bg-zinc-800 text-white hover:bg-zinc-700"
        }`}
      >
        ← Anterior
      </button>

      <span className="text-xs text-gray-500">{current} de {total}</span>

      <button
        onClick={onNext}
        disabled={current >= total}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
          current >= total
            ? "opacity-0 pointer-events-none"
            : "bg-kreoon text-white hover:bg-kreoon/90"
        }`}
      >
        Siguiente →
      </button>
    </div>
  );
}

// ── Main ──
interface Props {
  data: ReportData;
}

export default function BrandDiagnosisClient({ data }: Props) {
  const diagnosis = data.brand_diagnosis;
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  if (!diagnosis) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-gray-400">Diagnóstico no disponible.</p>
      </main>
    );
  }

  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const goPrev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <StepNav current={step} total={totalSteps} onStep={setStep} />

      {/* Spacer for fixed nav */}
      <div className="h-20" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="min-h-[calc(100vh-10rem)]"
        >
          {/* Step 1: Tu Marca */}
          {step === 1 && (
            <>
              <ErrorBoundary fallback={<SectionError name="Hero" />}>
                <DiagnosisHero diagnosis={diagnosis} />
              </ErrorBoundary>
              <ErrorBoundary fallback={<SectionError name="Presencia Social" />}>
                <SocialPresence profiles={diagnosis.social_profiles} />
              </ErrorBoundary>
            </>
          )}

          {/* Step 2: Diagnóstico */}
          {step === 2 && (
            <>
              <ErrorBoundary fallback={<SectionError name="Auditoría" />}>
                <ContentAudit posts={diagnosis.posts_analyzed} />
              </ErrorBoundary>
              <ErrorBoundary fallback={<SectionError name="Diagnóstico" />}>
                <StrategicDiagnosis diagnosis={diagnosis} />
              </ErrorBoundary>
            </>
          )}

          {/* Step 3: Competencia */}
          {step === 3 && (
            <ErrorBoundary fallback={<SectionError name="Competencia" />}>
              <CompetitorAnalysis
                competitors={diagnosis.competitors || []}
                competitorInsights={diagnosis.competitor_insights || ""}
                adInsights={diagnosis.ad_insights || ""}
                adLibrary={diagnosis.ad_library || { brand_ads: [], competitor_ads: [] }}
              />
            </ErrorBoundary>
          )}

          {/* Step 4: Oportunidades */}
          {step === 4 && (
            <ErrorBoundary fallback={<SectionError name="Oportunidades" />}>
              <Opportunities opportunities={diagnosis.opportunities} />
            </ErrorBoundary>
          )}

          {/* Step 5: Plan de Acción */}
          {step === 5 && (
            <>
              <ErrorBoundary fallback={<SectionError name="Propuesta" />}>
                <ServiceProposal
                  proposal={diagnosis.service_proposal}
                  brandName={diagnosis.brand_name}
                />
              </ErrorBoundary>
              <ErrorBoundary fallback={<SectionError name="Footer" />}>
                <DiagnosisFooter />
              </ErrorBoundary>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <StepButtons current={step} total={totalSteps} onPrev={goPrev} onNext={goNext} />

      <ErrorBoundary fallback={null}>
        <WhatsAppFloat />
      </ErrorBoundary>
    </main>
  );
}
