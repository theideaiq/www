import { requireAdmin } from '@/lib/auth';

/**
 * Creates a new marketing segment.
 *
 * @param name - The name of the segment.
 * @param criteria - The criteria for the segment.
 */
export async function createSegment(
  name: string,
  // biome-ignore lint/suspicious/noExplicitAny: Criteria structure is flexible
  criteria: Record<string, any>,
) {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('marketing_segments')
    .insert({ name, criteria })
    .select()
    .single();

  if (error) throw error;
  return data;
}
