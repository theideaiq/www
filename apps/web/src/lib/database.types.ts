export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          type: 'sale' | 'rental' | 'auction';
          category: string;
          stock_count: number;
          rental_tier: string | null;
          created_at: string;
          updated_at: string;
          details: Json;
          condition: 'new' | 'used' | 'refurbished' | 'open_box';
          seller: string;
          is_verified: boolean;
          slug: string | null;
          images: string[] | null;
        };
        Insert: {
          id?: string;
          name: string;
          // ...
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string | null;
          stock_count: number | null;
          price_override: number | null;
          attributes: Json;
          image_url: string | null;
        };
        Insert: {
          product_id: string;
          // ...
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
        };
        Insert: {
          cart_id: string;
          product_id: string;
          quantity: number;
        };
        Update: {
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey";
            columns: ["cart_id"];
            referencedRelation: "carts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      carts: {
        Row: {
          id: string;
          user_id: string | null;
        };
        Insert: {
          user_id: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          total_amount: number;
          shipping_address: Json | null;
          tracking_number: string | null;
          created_at: string;
          gateway_link_id: string | null;
          gateway_provider: string | null;
          gateway_metadata: Json | null;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      rentals: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          due_date: string;
          status: 'active' | 'returned' | 'overdue';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          item_name: string;
          status: string;
          amount: number;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      rental_catalog: {
        Row: {
          id: number;
          title: string;
          category: string;
          daily_rate: number;
          image_url: string | null;
          description: string | null;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
