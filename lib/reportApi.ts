import { nanoid } from 'nanoid';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { ReportData } from '@/types/report';

const REPORT_TTL_DAYS = 30;
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://jarvis-reports.vercel.app').trim();

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createReport(
  data: Omit<ReportData, 'id' | 'created_at' | 'expires_at'>,
): Promise<{ id: string; url: string }> {
  const id = nanoid(21);

  const now = new Date();
  const expires_at = new Date(now);
  expires_at.setDate(expires_at.getDate() + REPORT_TTL_DAYS);

  const row: ReportData = {
    ...data,
    id,
    created_at: now.toISOString(),
    expires_at: expires_at.toISOString(),
  };

  const { error } = await getSupabaseAdmin().from(process.env.SUPABASE_TABLE || 'jarvis_reports').insert(row);

  if (error) {
    throw new Error(`Failed to insert report: ${error.message}`);
  }

  const url = `${APP_URL}/r/${id}`;
  return { id, url };
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateReport(
  id: string,
  updates: Partial<ReportData>,
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from(process.env.SUPABASE_TABLE || 'jarvis_reports')
    .update(updates)
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update report: ${error.message}`);
  }
}

// ─── Get ─────────────────────────────────────────────────────────────────────

export async function getReport(id: string): Promise<ReportData | null> {
  const { data, error } = await getSupabaseAdmin()
    .from(process.env.SUPABASE_TABLE || 'jarvis_reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as ReportData;
}
