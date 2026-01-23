import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type CartItem, useCartStore } from './cart-store';

const mockItem: Omit<CartItem, 'quantity'> = {
  id: 'product-1',
  productId: 'p1',
  title: 'Apple',
  price: 100,
  image: 'apple.jpg',
};

const mockItem2: Omit<CartItem, 'quantity'> = {
  id: 'product-2',
  productId: 'p2',
  title: 'Banana',
  price: 50,
  image: 'banana.jpg',
};

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], total: 0 });
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should start with an empty cart', () => {
    const { items, total } = useCartStore.getState();
    expect(items).toEqual([]);
    expect(total).toBe(0);
  });

  it('should add items to the cart', () => {
    const { addItem } = useCartStore.getState();

    addItem(mockItem);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ ...mockItem, quantity: 1 });
    expect(state.total).toBe(100);
  });

  it('should handle duplicate items correctly (increments quantity)', () => {
    const { addItem } = useCartStore.getState();

    addItem(mockItem);
    addItem(mockItem);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ ...mockItem, quantity: 2 });
    expect(state.total).toBe(200);
  });

  it('should add different items', () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);
    addItem(mockItem2);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(2);
    expect(state.total).toBe(150);
  });

  it('should remove items from the cart', () => {
    const { addItem, removeItem } = useCartStore.getState();

    addItem(mockItem);
    addItem(mockItem2);

    removeItem(mockItem.id);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(mockItem2.id);
    expect(state.total).toBe(50);
  });

  it('should clear the cart', () => {
    const { addItem, clearCart } = useCartStore.getState();

    addItem(mockItem);
    clearCart();

    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);
  });

  it('should update quantity directly', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(mockItem);

    updateQuantity(mockItem.id, 5);
    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(5);
    expect(state.total).toBe(500);
  });

  it('should persist state to localStorage', () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);

    const stored = localStorage.getItem('cart-storage-v2');
    expect(stored).toBeDefined();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.items[0].id).toBe(mockItem.id);
      expect(parsed.state.total).toBe(100);
    }
  });
});
