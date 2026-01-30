import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCartStore } from './cart-store';

// Helper to create a valid Cart Item
const createMockItem = (id: string, title = 'Test Item') => ({
  id,
  productId: `p-${id}`,
  title,
  price: 100,
  image: '/test.jpg',
  quantity: 1, // Store might add this, but good to have in mock
});

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
    const apple = createMockItem('apple', 'Apple');
    const banana = createMockItem('banana', 'Banana');

    addItem(apple);
    expect(useCartStore.getState().items).toEqual([
      { ...apple, quantity: 1 }
    ]);

    addItem(banana);
    expect(useCartStore.getState().items).toEqual([
      { ...apple, quantity: 1 },
      { ...banana, quantity: 1 }
    ]);
  });

  it('should remove items from the cart', () => {
    const { addItem, removeItem } = useCartStore.getState();
    const apple = createMockItem('apple');
    const banana = createMockItem('banana');

    addItem(apple);
    addItem(banana);

    removeItem('apple');
    expect(useCartStore.getState().items).toEqual([
      { ...banana, quantity: 1 }
    ]);
  });

  it('should clear the cart', () => {
    const { addItem, clearCart } = useCartStore.getState();
    const apple = createMockItem('apple');
    const banana = createMockItem('banana');

    addItem(apple);
    addItem(banana);

    clearCart();
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('should handle duplicate items correctly (increments quantity)', () => {
    const { addItem } = useCartStore.getState();
    const apple = createMockItem('apple');

    addItem(apple);
    addItem(apple);

    // Assuming the store increments quantity for duplicates
    expect(useCartStore.getState().items).toEqual([
      { ...apple, quantity: 2 }
    ]);
  });

  it('should persist state to localStorage', () => {
    const { addItem } = useCartStore.getState();
    const item = createMockItem('persistent-item');
    addItem(item);

    const stored = localStorage.getItem('cart-storage');
    expect(stored).toBeDefined();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.items).toEqual([{ ...item, quantity: 1 }]);
    }
  });
});
