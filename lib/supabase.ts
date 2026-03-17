import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _anon: SupabaseClient | null = null;
let _admin: SupabaseClient | null = null;

export function getSupabaseAnon(): SupabaseClient {
  if (!_anon) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing SUPABASE_URL or ANON_KEY');
    _anon = createClient(url, key);
  }
  return _anon;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) throw new Error('Missing SUPABASE_URL or SERVICE_KEY');
    _admin = createClient(url, key);
  }
  return _admin;
}
