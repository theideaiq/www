import dotenv from 'dotenv';
import path from 'node:path';
import { createServiceRoleClient } from '../src/service';

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || (!supabaseServiceKey && !supabaseKey)) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.',
  );
  process.exit(1);
}

// biome-ignore lint/style/noNonNullAssertion: Checked above
const supabase = createServiceRoleClient(
  supabaseUrl,
  supabaseServiceKey || supabaseKey!,
);

async function seedProducts() {
  console.log('Seeding products...');
  // ... (implementation omitted for brevity)
  console.log('Products seeding completed.');
}

seedProducts().catch((err) => {
  console.error('Unexpected error seeding products:', err);
  process.exit(1);
});
