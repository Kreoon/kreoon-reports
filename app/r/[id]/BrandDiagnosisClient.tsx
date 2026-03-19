"use client";

import { Component, type ReactNode } from "react";
import type { ReportData } from "@/types/report";
import dynamic from "next/dynamic";

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center text-zinc-400">
        <p className="text-sm">
          Sección &quot;{name}&quot; no disponible para este diagnóstico
        </p>
      </div>
    </div>
  );
}

// ── Lazy imports ──
const DiagnosisHero = dynamic(
  () => import("@/components/diagnosis/DiagnosisHero"),
  { ssr: false },
);
const SocialPresence = dynamic(
  () => import("@/components/diagnosis/SocialPresence"),
  { ssr: false },
);
const ContentAudit = dynamic(
  () => import("@/components/diagnosis/ContentAudit"),
  { ssr: false },
);
const StrategicDiagnosis = dynamic(
  () => import("@/components/diagnosis/StrategicDiagnosis"),
  { ssr: false },
);
const Opportunities = dynamic(
  () => import("@/components/diagnosis/Opportunities"),
  { ssr: false },
);
const ServiceProposal = dynamic(
  () => import("@/components/diagnosis/ServiceProposal"),
  { ssr: false },
);
const DiagnosisFooter = dynamic(
  () => import("@/components/diagnosis/DiagnosisFooter"),
  { ssr: false },
);
const WhatsAppFloat = dynamic(
  () => import("@/components/report/WhatsAppFloat"),
  { ssr: false },
);

// ── Props ──
interface Props {
  data: ReportData;
}

export default function BrandDiagnosisClient({ data }: Props) {
  const diagnosis = data.brand_diagnosis;

  if (!diagnosis) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-gray-400">Diagnóstico no disponible.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <ErrorBoundary fallback={<SectionError name="Hero" />}>
        <DiagnosisHero diagnosis={diagnosis} />
      </ErrorBoundary>

      <ErrorBoundary fallback={<SectionError name="Presencia Social" />}>
        <SocialPresence profiles={diagnosis.social_profiles} />
      </ErrorBoundary>

      <ErrorBoundary fallback={<SectionError name="Auditoría de Contenido" />}>
        <ContentAudit posts={diagnosis.posts_analyzed} />
      </ErrorBoundary>

      <ErrorBoundary fallback={<SectionError name="Diagnóstico Estratégico" />}>
        <StrategicDiagnosis diagnosis={diagnosis} />
      </ErrorBoundary>

      <ErrorBoundary fallback={<SectionError name="Oportunidades" />}>
        <Opportunities opportunities={diagnosis.opportunities} />
      </ErrorBoundary>

      <ErrorBoundary fallback={<SectionError name="Propuesta de Servicios" />}>
        <ServiceProposal
          proposal={diagnosis.service_proposal}
          brandName={diagnosis.brand_name}
        />
      </ErrorBoundary>

      <ErrorBoundary fallback={<SectionError name="Footer" />}>
        <DiagnosisFooter />
      </ErrorBoundary>

      <ErrorBoundary fallback={null}>
        <WhatsAppFloat />
      </ErrorBoundary>
    </main>
  );
}
