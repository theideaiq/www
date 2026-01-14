import { createClient } from '@supabase/supabase-js';
import { env } from '../env';

// We use the service role key to bypass RLS for the bot's operations
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL ?? "https://mock.supabase.co",
  env.SUPABASE_SERVICE_ROLE_KEY ?? "mock",
  {
    auth: {
      persistSession: false,
    },
  }
);
