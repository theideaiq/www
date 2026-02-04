import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCartStore } from './cart-store';

describe('Cart Store', () => {
  // Reset store before each test to ensure isolation
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('should start with an empty cart', () => {
    const { items } = useCartStore.getState();
    expect(items).toEqual([]);
  });

  const mockItemApple = {
    id: 'apple-id',
    productId: 'apple-prod',
    title: 'Apple',
    price: 1000,
    image: 'apple.png',
  };

  const mockItemBanana = {
    id: 'banana-id',
    productId: 'banana-prod',
    title: 'Banana',
    price: 500,
    image: 'banana.png',
  };

  it('should add items to the cart', () => {
    const { addItem } = useCartStore.getState();

    addItem(mockItemApple);
    expect(useCartStore.getState().items).toEqual([
      { ...mockItemApple, quantity: 1 },
    ]);

    addItem(mockItemBanana);
    expect(useCartStore.getState().items).toEqual([
      { ...mockItemApple, quantity: 1 },
      { ...mockItemBanana, quantity: 1 },
    ]);
  });

  it('should remove items from the cart', () => {
    const { addItem, removeItem } = useCartStore.getState();

    addItem(mockItemApple);
    addItem(mockItemBanana);

    removeItem(mockItemApple.id);
    expect(useCartStore.getState().items).toEqual([
      { ...mockItemBanana, quantity: 1 },
    ]);
  });

  it('should clear the cart', () => {
    const { addItem, clearCart } = useCartStore.getState();

    addItem(mockItemApple);
    addItem(mockItemBanana);

    clearCart();
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('should handle duplicate items correctly (increments quantity)', () => {
    const { addItem } = useCartStore.getState();

    addItem(mockItemApple);
    addItem(mockItemApple);
    expect(useCartStore.getState().items).toEqual([
      { ...mockItemApple, quantity: 2 },
    ]);
  });

  it('should persist state to localStorage', () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItemApple);

    // v2 key as defined in the store
    const stored = localStorage.getItem('cart-storage-v2');
    expect(stored).toBeDefined();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.items).toEqual([{ ...mockItemApple, quantity: 1 }]);
    }
  });
});
