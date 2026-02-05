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

async function seedAccounts() {
  console.log('Seeding accounts...');

  const accounts = [
    {
      id: 'acc_1',
      name: 'Default Account',
      slug: 'default',
      settings: {
        theme: 'light',
        currency: 'USD',
      },
    },
  ];

  for (const account of accounts) {
    const { error } = await supabase.from('accounts').upsert(account);

    if (error) {
      console.error(`Error seeding account ${account.name}:`, error);
    } else {
      console.log(`Seeded account: ${account.name}`);
    }
  }

  console.log('Accounts seeding completed.');
}

seedAccounts().catch((err) => {
  console.error('Unexpected error seeding accounts:', err);
  process.exit(1);
});
