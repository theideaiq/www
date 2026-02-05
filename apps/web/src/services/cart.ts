import { createClient } from '@/lib/supabase/client';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

/**
 * Gets or creates a cart ID for the user.
 */
async function getOrCreateCartId(
  // biome-ignore lint/suspicious/noExplicitAny: Supabase client type complexity
  supabase: any,
  userId: string,
): Promise<string | null> {
  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (cart) return cart.id;

  const { data: newCart, error } = await supabase
    .from('carts')
    .insert({ user_id: userId })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating cart:', error);
    return null;
  }

  return newCart.id;
}

/**
 * Syncs the local cart with the database.
 */
export async function syncCart(items: CartItem[]) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const cartId = await getOrCreateCartId(supabase, user.id);
  if (!cartId) return;

  // Clear existing items (simple sync strategy)
  await supabase.from('cart_items').delete().eq('cart_id', cartId);

  // Insert new items
  if (items.length > 0) {
    const { error } = await supabase.from('cart_items').insert(
      items.map((item) => ({
        cart_id: cartId,
        product_id: item.productId,
        quantity: item.quantity,
      })),
    );

    if (error) console.error('Error syncing items:', error);
  }
}

/**
 * Fetches the user's cart from the database.
 */
export async function fetchCart(): Promise<CartItem[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!cart) return [];

  const { data: items, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cart.id);

  if (error) {
    console.error('Error fetching cart:', error);
    return [];
  }

  // biome-ignore lint/suspicious/noExplicitAny: Type casting for mapped items
  return (items as any[]).map((item) => ({
    id: item.id,
    productId: item.product_id,
    quantity: item.quantity,
  }));
}
