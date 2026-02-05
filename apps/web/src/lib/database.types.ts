export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// biome-ignore lint/suspicious/noExplicitAny: Database type placeholder
export type Database = any;

export interface DB {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          stock_count: number;
          category: string;
          condition: string;
          seller: string;
          is_verified: boolean;
          image_url: string | null;
          images: string[];
          slug: string;
          details: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          // ...
        };
        Update: Record<string, never>; // Replaced {} with Record<string, never>
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          price_override: number | null;
          stock_count: number;
          attributes: Json;
          image_url: string | null;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
        };
      };
    };
  };
}
