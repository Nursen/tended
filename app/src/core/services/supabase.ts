/**
 * Supabase client singleton
 * Reads credentials from environment variables set in .env
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
    'Auth and cloud sync will be disabled. App will run in local-only mode.'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/** Whether Supabase is configured and available */
export const isSupabaseConfigured = (): boolean => supabase !== null;
