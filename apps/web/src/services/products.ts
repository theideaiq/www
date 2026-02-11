import { Logger } from '@repo/utils';
import { createClient } from '@/lib/supabase/client';
// import type { Database, Json } from '@/lib/database.types';

// type DBProduct = Database['public']['Tables']['products']['Row'] & {
//   details: Json;
// };

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  description: string;
  // biome-ignore lint/suspicious/noExplicitAny: Flexible JSON structure
  details: Record<string, any>;
  variants: ProductVariant[];
  stock: number;
}

export async function getProducts(
  category?: string,
  featured?: boolean,
): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase.from('products').select(`
      *,
      product_variants (*)
    `);

  if (category && category !== 'all') {
    query = query.eq('category_id', category);
  }

  if (featured) {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query;

  if (error) {
    Logger.error('Error fetching products:', error);
    return [];
  }

  return data.map((item) => {
    // Transform variants
    const variants =
      // biome-ignore lint/suspicious/noExplicitAny: Joined data type
      (item.product_variants as any[])?.map((v) => ({
        id: v.id,
        name: v.name,
        price: v.price,
        sku: v.sku,
        stock: v.stock_count,
      })) || [];

    return {
      id: item.id,
      name: item.name,
      price: item.price,
      compareAtPrice: item.compare_at_price || undefined,
      currency: 'IQD',
      images: [item.image_url, ...(item.gallery_urls || [])].filter(Boolean),
      category: item.category_id, // You might want to fetch category name
      tags: item.tags || [],
      rating: 4.5, // Placeholder as DB might not have ratings yet
      reviewCount: 0,
      isNew:
        new Date(item.created_at) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isFeatured: item.is_featured,
      isVerified: item.is_verified,
      description: item.description || '',
      // biome-ignore lint/suspicious/noExplicitAny: Casting JSONB
      details: (item.details as Record<string, any>) || {},
      variants,
      stock: item.stock_count,
    };
  });
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;

  const variants =
    // biome-ignore lint/suspicious/noExplicitAny: Joined data type
    (data.product_variants as any[])?.map((v) => ({
      id: v.id,
      name: v.name,
      price: v.price,
      sku: v.sku,
      stock: v.stock_count,
    })) || [];

  return {
    id: data.id,
    name: data.name,
    price: data.price,
    compareAtPrice: data.compare_at_price || undefined,
    currency: 'IQD',
    images: [data.image_url, ...(data.gallery_urls || [])].filter(Boolean),
    category: data.category_id,
    tags: data.tags || [],
    rating: 4.5,
    reviewCount: 0,
    isNew: false,
    isFeatured: data.is_featured,
    isVerified: data.is_verified,
    description: data.description || '',
    // biome-ignore lint/suspicious/noExplicitAny: Casting JSONB
    details: (data.details as Record<string, any>) || {},
    variants,
    stock: data.stock_count,
  };
}
