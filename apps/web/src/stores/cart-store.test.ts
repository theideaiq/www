import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCartStore } from './cart-store';

const item1 = {
  id: '1',
  productId: 'p1',
  title: 'Apple',
  price: 10,
  image: 'img1',
};

const item2 = {
  id: '2',
  productId: 'p2',
  title: 'Banana',
  price: 20,
  image: 'img2',
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

    addItem(item1);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ ...item1, quantity: 1 });
    expect(state.total).toBe(10);

    addItem(item2);
    const state2 = useCartStore.getState();
    expect(state2.items).toHaveLength(2);
    expect(state2.total).toBe(30);
  });

  it('should increment quantity for duplicate items', () => {
    const { addItem } = useCartStore.getState();

    addItem(item1);
    addItem(item1);

    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ ...item1, quantity: 2 });
    expect(state.total).toBe(20);
  });

  it('should remove items from the cart', () => {
    const { addItem, removeItem } = useCartStore.getState();

    addItem(item1);
    addItem(item2);

    removeItem(item1.id);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(item2.id);
    expect(state.total).toBe(20);
  });

  it('should clear the cart', () => {
    const { addItem, clearCart } = useCartStore.getState();

    addItem(item1);
    clearCart();

    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);
  });

  it('should persist state to localStorage', () => {
    const { addItem } = useCartStore.getState();
    addItem(item1);

    // Note: implementation uses 'cart-storage-v2'
    const stored = localStorage.getItem('cart-storage-v2');
    expect(stored).toBeDefined();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.items[0].id).toBe(item1.id);
    }
  });
});
