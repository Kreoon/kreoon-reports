import { NextRequest, NextResponse } from 'next/server';
import { getReport } from '@/lib/reportApi';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
  }

  const report = await getReport(id);

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // Check expiry
  if (new Date(report.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Report has expired' }, { status: 410 });
  }

  return NextResponse.json(report, { status: 200 });
}
