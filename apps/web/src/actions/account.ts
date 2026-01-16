'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const fullName = formData.get('fullName') as string;

  if (!fullName) {
    throw new Error('Full name is required');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id);

  if (error) {
    throw new Error('Failed to update profile');
  }

  revalidatePath('/[locale]/account', 'page');
}
