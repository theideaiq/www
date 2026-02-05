import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type CartItem, fetchCart, syncCart } from '@/services/cart';

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  syncWithDB: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, _get) => ({
      items: [],
      total: 0,
      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === newItem.id);
          // biome-ignore lint/suspicious/noImplicitAnyLet: Variable initialized conditionally
          let updatedItems;
          if (existing) {
            updatedItems = state.items.map((i) =>
              i.id === newItem.id
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i,
            );
          } else {
            updatedItems = [...state.items, newItem];
          }
          syncCart(updatedItems);
          return { items: updatedItems };
        }),
      removeItem: (id) =>
        set((state) => {
          const updatedItems = state.items.filter((i) => i.id !== id);
          syncCart(updatedItems);
          return { items: updatedItems };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const updatedItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i,
          );
          syncCart(updatedItems);
          return { items: updatedItems };
        }),
      clearCart: () => {
        syncCart([]);
        set({ items: [] });
      },
      syncWithDB: async () => {
        const items = await fetchCart();
        set({ items });
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
