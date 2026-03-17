import { NextRequest, NextResponse } from 'next/server';
import { createReport } from '@/lib/reportApi';
import type { ReportData } from '@/types/report';

// Required top-level fields that Jarvis must always supply
const REQUIRED_FIELDS: (keyof Omit<ReportData, 'id' | 'created_at' | 'expires_at'>)[] = [
  'platform',
  'content_type',
  'original_url',
  'creator_username',
  'caption',
  'hashtags',
  'metrics',
  'gemini_analysis',
  'strategic_analysis',
  'verdict',
  'scores',
  'production_guide',
  'publish_strategy',
  'success_metrics',
  'branding',
];

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = req.headers.get('x-jarvis-secret');

  const expectedSecret = process.env.JARVIS_INTERNAL_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // ── Validate required fields ──────────────────────────────────────────────
  const missing = REQUIRED_FIELDS.filter((field) => body[field] === undefined);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: 'Missing required fields', missing },
      { status: 422 },
    );
  }

  // ── Create report ─────────────────────────────────────────────────────────
  try {
    const data = body as Omit<ReportData, 'id' | 'created_at' | 'expires_at'>;
    const { id, url } = await createReport(data);

    // Compute expires_at for the response (mirrors logic inside createReport)
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 30);

    return NextResponse.json(
      { id, url, expires_at: expires_at.toISOString() },
      { status: 201 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
