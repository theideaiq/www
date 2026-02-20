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

  it('should add items to the cart', () => {
    const { addItem } = useCartStore.getState();

    const apple = { id: 'apple', productId: 'apple', title: 'Apple', price: 100, image: 'apple.png' };
    const banana = { id: 'banana', productId: 'banana', title: 'Banana', price: 200, image: 'banana.png' };

    addItem(apple);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]).toMatchObject({ id: 'apple', quantity: 1 });

    addItem(banana);
    expect(useCartStore.getState().items).toHaveLength(2);
    expect(useCartStore.getState().items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'apple', quantity: 1 }),
        expect.objectContaining({ id: 'banana', quantity: 1 })
      ])
    );
  });

  it('should remove items from the cart', () => {
    const { addItem, removeItem } = useCartStore.getState();
    const apple = { id: 'apple', productId: 'apple', title: 'Apple', price: 100, image: 'apple.png' };
    const banana = { id: 'banana', productId: 'banana', title: 'Banana', price: 200, image: 'banana.png' };

    addItem(apple);
    addItem(banana);

    removeItem('apple');
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]).toMatchObject({ id: 'banana' });
  });

  it('should clear the cart', () => {
    const { addItem, clearCart } = useCartStore.getState();
    const apple = { id: 'apple', productId: 'apple', title: 'Apple', price: 100, image: 'apple.png' };

    addItem(apple);
    clearCart();
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('should handle duplicate items correctly (increments quantity)', () => {
    const { addItem } = useCartStore.getState();
    const apple = { id: 'apple', productId: 'apple', title: 'Apple', price: 100, image: 'apple.png' };

    addItem(apple);
    addItem(apple);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]).toMatchObject({ id: 'apple', quantity: 2 });
  });

  it('should persist state to localStorage', () => {
    const { addItem } = useCartStore.getState();
    const item = { id: 'persistent-item', productId: 'p1', title: 'Item', price: 100, image: 'img.png' };
    addItem(item);

    const stored = localStorage.getItem('cart-storage');
    expect(stored).toBeDefined();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.items).toHaveLength(1);
      expect(parsed.state.items[0]).toMatchObject({ id: 'persistent-item', quantity: 1 });
    }
  });
});
