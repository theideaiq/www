import type { Database } from '@repo/database/types';
import { droidEnv as env } from '@repo/env/droid';
import { createClient } from '@supabase/supabase-js';

// We use the service role key to bypass RLS for the bot's operations.
// The bot acts as an admin/system user to search products and read data
// that might be restricted or to perform actions on behalf of the system.

// Provide fallback values for build time if environment variables are missing.
// This prevents "supabaseUrl is required" errors during `next build` in CI environments
// where secrets might not be available (even if SKIP_ENV_VALIDATION is true).
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
