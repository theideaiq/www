'use client';

import { createBrowserClient } from '@supabase/ssr';

// We need to use process.env here because the @repo/env package is server-side only
// and using NEXT_PUBLIC_ variables directly is the standard way in Next.js client components.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Creates a Supabase client for Client Components.
 * This client uses the anonymous key and respects RLS policies.
 * It's a singleton to prevent creating multiple instances.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
