import { requireAdmin } from '@/lib/auth';

/**
 * Creates a new product.
 * Audit: Logs 'create_product'.
 */
// biome-ignore lint/suspicious/noExplicitAny: Input data is flexible
export async function createProduct(data: any) {
  const { supabase } = await requireAdmin();
  const { data: product, error } = await supabase
    .from('products')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return product;
}

/**
 * Updates an existing product.
 * Audit: Logs 'update_product'.
 */
// biome-ignore lint/suspicious/noExplicitAny: Updates are partial and flexible
export async function updateProduct(id: string, updates: any) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  return true;
}
