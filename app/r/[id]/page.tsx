import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getReport } from '@/lib/reportApi';
import type { ReportData } from '@/types/report';
import ReportPageClient from './ReportPageClient';
import BrandDiagnosisClient from './BrandDiagnosisClient';

// ── Types ─────────────────────────────────────────
interface PageProps {
  params: Promise<{ id: string }>;
}

// ── Metadata ──────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const report: ReportData | null = await getReport(id);

  if (!report) {
    return {
      title: 'Reporte no encontrado',
      description: 'Este reporte no existe o ha expirado.',
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? 'https://reports.kreoon.com';

  // Brand diagnosis metadata
  if (report.report_type === 'brand-diagnosis' && report.brand_diagnosis) {
    const bd = report.brand_diagnosis;
    const title = `Diagnóstico: ${bd.brand_name} — Kreoon`;
    const description = `Diagnóstico de marca. Score: ${bd.overall_score}/100. Industria: ${bd.brand_industry}.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/r/${id}`,
        type: 'article',
        locale: 'es_CO',
        siteName: 'Kreoon Reports',
      },
      robots: { index: false, follow: false },
    };
  }

  // Content analysis metadata
  const creatorHandle = report.creator_username
    ? `@${report.creator_username}`
    : 'Contenido';

  const platformLabel =
    report.platform.charAt(0).toUpperCase() + report.platform.slice(1);

  const title = `Análisis: ${creatorHandle} en ${platformLabel} — Kreoon Reports`;
  const description = `Reporte estratégico de contenido. Score total: ${report.scores.total}/10. Hook ${report.scores.hook}/10 · Viralidad ${report.scores.virality}/10 · Estrategia ${report.scores.strategy}/10.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/r/${id}`,
      type: 'article',
      locale: 'es_CO',
      siteName: 'Kreoon Reports',
      images: [
        {
          url: `${baseUrl}/api/og?id=${id}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/api/og?id=${id}`],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

// ── Page (Server Component) ───────────────────────
export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;
  const report: ReportData | null = await getReport(id);

  if (!report) {
    notFound();
  }

  // Check expiry
  if (new Date(report.expires_at) < new Date()) {
    notFound();
  }

  // Route to correct client component based on report type
  if (report.report_type === 'brand-diagnosis' && report.brand_diagnosis) {
    return <BrandDiagnosisClient data={report} />;
  }

  return <ReportPageClient data={report} />;
}
