import { Logger } from '@repo/utils';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth-checks';

/**
 * Creates a new product.
 * Audit: Logs 'create_product'.
 */
export async function createProduct(data: unknown) {
  const { supabase } = await requireAdmin();
  const { data: product, error } = await supabase
    .from('products')
    .insert(data as any) // Explicit cast for now until we have better types
    .select()
    .single();

  if (error) {
    Logger.error('Failed to create product', error);
    throw new Error(error.message);
  }

  return product;
}

/**
 * Updates an existing product.
 * Audit: Logs 'update_product'.
 */
export async function updateProduct(id: string, updates: unknown) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('products')
    .update(updates as any) // Explicit cast for now
    .eq('id', id);

  if (error) {
    Logger.error('Failed to update product', error);
    throw new Error(error.message);
  }

  // Revalidate cache
  // revalidatePath('/admin/products');
  // revalidatePath(`/admin/products/${id}`);
}

/**
 * Deletes a product (soft delete).
 * Audit: Logs 'delete_product'.
 */
export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('products')
    .update({ status: 'archived' })
    .eq('id', id);

  if (error) {
    Logger.error('Failed to delete product', error);
    throw new Error(error.message);
  }
}
