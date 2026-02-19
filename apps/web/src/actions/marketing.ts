export async function createSegment(
  name: string,
  criteria: Record<string, unknown>,
) {
  const { supabase } = await requireAdmin();
  const { data: segment, error } = await supabase
    .from('marketing_segments')
    .insert({ name, criteria })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Calculate Segment Size
  // This is simplified. In a real app, you'd run a query based on 'criteria'
  // For now, we'll just count all users for the 'all' segment
  let count = 0;
  if (criteria.type === 'all') {
    const { count: total } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    count = total || 0;
  }

  return { ...segment, count };
}
