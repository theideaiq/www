import { createClient } from '@/lib/supabase/client';

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  seller: string;
  rating: number;
  image: string;
  isVerified: boolean;
}

/**
 * Fetches a list of available products from Supabase.
 *
 * @returns A promise resolving to an array of products.
 */
export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        'id, name, price, category, image_url, condition, seller, is_verified, reviews(rating)',
      )
      .gt('stock_count', 0);

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    if (!data) return [];

    return data.map((item: any) => {
      // Calculate average rating
      const ratings = item.reviews?.map((r: any) => r.rating) || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
          : 0;

      return {
        id: item.id,
        title: item.name,
        price: Number(item.price),
        category: item.category,
        condition: item.condition,
        seller: item.seller,
        rating: Number(avgRating.toFixed(1)),
        image: item.image_url,
        isVerified: item.is_verified,
      };
    });
  } catch (err) {
    console.error('Unexpected error fetching products:', err);
    return [];
  }
}
