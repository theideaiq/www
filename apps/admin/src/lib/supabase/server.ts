import { adminEnv } from '@repo/env/admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for Server Actions and Route Handlers.
 * Handles cookie management for authentication.
 *
 * NOTE: This client has full admin privileges via the service role key.
 * Ensure proper authorization checks are performed before using this client.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    adminEnv.NEXT_PUBLIC_SUPABASE_URL,
    adminEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
