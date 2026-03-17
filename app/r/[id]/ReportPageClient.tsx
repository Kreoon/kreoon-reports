'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ReportData } from '@/types/report';
import type { ScriptLine } from '@/types/report';

// ── Existing report section components ───────────────
import HeroSection from '@/components/report/HeroSection';
import ScorecardSection from '@/components/report/ScorecardSection';
import VisualAnalysisSection from '@/components/report/VisualAnalysisSection';
import StrategicAnalysisSection from '@/components/report/StrategicAnalysisSection';
import VerdictSection from '@/components/report/VerdictSection';
import ReplicaPlanSection from '@/components/report/ReplicaPlanSection';
import ProductionGuideSection from '@/components/report/ProductionGuideSection';
import PublishingStrategySection from '@/components/report/PublishingStrategySection';
import SuccessMetricsSection from '@/components/report/SuccessMetricsSection';
import CTABanner from '@/components/report/CTABanner';
import ReportFooter from '@/components/report/ReportFooter';
import ScrollNavbar from '@/components/report/ScrollNavbar';
import TeleprompterModal from '@/components/report/TeleprompterModal';

// ── Types ─────────────────────────────────────────────
interface ReportPageClientProps {
  data: ReportData;
}

// Section IDs must match what each component renders and ScrollNavbar expects.
// HeroSection has no id on its <section>, so we wrap it.
// All others own their own id attributes internally.
export const SECTION_IDS = [
  'resumen',      // Hero — added by wrapper div
  'scorecard',    // ScorecardSection owns this id
  'visual',       // VisualAnalysisSection owns this id
  'strategic',    // StrategicAnalysisSection owns this id
  'verdict',      // VerdictSection owns this id
  'replica',      // ReplicaPlanSection owns this id
  'production',   // ProductionGuideSection owns this id
  'publishing',   // PublishingStrategySection owns this id
  'metrics',      // SuccessMetricsSection owns this id
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

// ── Component ─────────────────────────────────────────
export default function ReportPageClient({ data }: ReportPageClientProps) {
  // ── State ──
  const [activeSection, setActiveSection] = useState<string>('resumen');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Teleprompter
  const [teleprompterOpen, setTeleprompterOpen] = useState(false);
  const [teleprompterScript, setTeleprompterScript] = useState<ScriptLine[]>([]);
  const [teleprompterVersionLabel, setTeleprompterVersionLabel] = useState('');

  // ── IntersectionObserver — track active section ──
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ── Scroll progress bar ──
  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Teleprompter handlers ──
  const handleOpenTeleprompter = useCallback(
    (version: string, script: ScriptLine[]) => {
      setTeleprompterScript(script);
      setTeleprompterVersionLabel(version);
      setTeleprompterOpen(true);
    },
    []
  );

  const handleCloseTeleprompter = useCallback(() => {
    setTeleprompterOpen(false);
  }, []);

  // ── Render ──
  return (
    <>
      {/* ── Scroll progress bar (top of viewport) ── */}
      <div
        className="fixed top-0 left-0 z-[60] h-[3px] bg-kreoon transition-[width] duration-100"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* ── Sticky nav bar (appears after scrolling past hero) ── */}
      <ScrollNavbar activeSection={activeSection} />

      {/* ── Main content ── */}
      <main>

        {/* Hero — wrapped to give it the "resumen" scroll target */}
        <div id="resumen" className="scroll-mt-0">
          <HeroSection data={data} />
        </div>

        {/* Scorecard — owns id="scorecard" */}
        <ScorecardSection
          scores={data.scores}
          metrics={data.metrics}
          verdict={data.verdict}
        />

        {/* Visual Analysis — owns id="visual" */}
        <VisualAnalysisSection gemini={data.gemini_analysis} />

        {/* Strategic Analysis — owns id="strategic" */}
        <StrategicAnalysisSection
          analysis={data.strategic_analysis}
          scores={data.scores}
        />

        {/* Verdict — owns id="verdict" */}
        <VerdictSection
          verdict={data.verdict}
          metrics={data.metrics}
        />

        {/* Replica Plan — owns id="replica" */}
        <ReplicaPlanSection
          replicas={data.replicas}
          wizard={data.wizard_config}
          onOpenTeleprompter={handleOpenTeleprompter}
          repurposing={data.publish_strategy.repurposing}
        />

        {/* Production Guide — owns id="production" */}
        <ProductionGuideSection guide={data.production_guide} />

        {/* Publishing Strategy — owns id="publishing" */}
        <PublishingStrategySection strategy={data.publish_strategy} />

        {/* Success Metrics — owns id="metrics" */}
        <SuccessMetricsSection metrics={data.success_metrics} />

        {/* CTA Banner */}
        <CTABanner />

        {/* Footer */}
        <ReportFooter
          reportId={data.id}
          generatedDate={data.created_at}
        />

      </main>

      {/* ── Teleprompter Modal ── */}
      <TeleprompterModal
        isOpen={teleprompterOpen}
        onClose={handleCloseTeleprompter}
        script={teleprompterScript}
        versionLabel={teleprompterVersionLabel}
      />
    </>
  );
}
