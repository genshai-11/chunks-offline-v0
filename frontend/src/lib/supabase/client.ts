import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY

const fallbackSupabaseUrl = 'http://127.0.0.1:54321'
const fallbackSupabaseKey = 'missing-supabase-publishable-key'

export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl && supabasePublishableKey)
}

export function assertSupabaseConfig(): void {
  if (!supabaseUrl) {
    throw new Error('Missing VITE_SUPABASE_URL. Add it to frontend/.env.local.')
  }

  if (!supabasePublishableKey) {
    throw new Error(
      'Missing VITE_SUPABASE_PUBLISHABLE_KEY. Add it to frontend/.env.local. VITE_SUPABASE_ANON_KEY is also supported as a backward-compatible alias.',
    )
  }
}

export const supabase = createClient(
  supabaseUrl ?? fallbackSupabaseUrl,
  supabasePublishableKey ?? fallbackSupabaseKey,
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  },
)
