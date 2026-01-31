import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCartStore, type CartItem } from './cart-store';

// Helper to create valid mock items
const createMockItem = (id: string, price = 100): Omit<CartItem, 'quantity'> => ({
  id,
  productId: `prod-${id}`,
  title: `Product ${id}`,
  price,
  image: `/img/${id}.jpg`,
});

describe('Cart Store', () => {
  // Reset store before each test to ensure isolation
  beforeEach(() => {
    useCartStore.setState({ items: [], total: 0 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('should start with an empty cart', () => {
    const { items, total } = useCartStore.getState();
    expect(items).toEqual([]);
    expect(total).toBe(0);
  });

  it('should add items to the cart', () => {
    const { addItem } = useCartStore.getState();
    const item1 = createMockItem('1', 100);
    const item2 = createMockItem('2', 200);

    addItem(item1);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]).toMatchObject({ ...item1, quantity: 1 });
    expect(useCartStore.getState().total).toBe(100);

    addItem(item2);
    expect(useCartStore.getState().items).toHaveLength(2);
    expect(useCartStore.getState().total).toBe(300); // 100 + 200
  });

  it('should increment quantity when adding duplicate item', () => {
    const { addItem } = useCartStore.getState();
    const item = createMockItem('1', 100);

    addItem(item);
    addItem(item);

    const { items, total } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ ...item, quantity: 2 });
    expect(total).toBe(200);
  });

  it('should remove items from the cart', () => {
    const { addItem, removeItem } = useCartStore.getState();
    const item1 = createMockItem('1', 100);
    const item2 = createMockItem('2', 200);

    addItem(item1);
    addItem(item2);

    removeItem('1');
    const { items, total } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('2');
    expect(total).toBe(200);
  });

  it('should clear the cart', () => {
    const { addItem, clearCart } = useCartStore.getState();
    addItem(createMockItem('1'));

    clearCart();
    const { items, total } = useCartStore.getState();
    expect(items).toEqual([]);
    expect(total).toBe(0);
  });

  it('should persist state to localStorage', () => {
    const { addItem } = useCartStore.getState();
    const item = createMockItem('persistent');
    addItem(item);

    const stored = localStorage.getItem('cart-storage-v2');
    expect(stored).toBeDefined();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.items[0]).toMatchObject({ ...item, quantity: 1 });
    }
  });

  it('should update quantity correctly', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    const item = createMockItem('1', 100);

    addItem(item);

    updateQuantity('1', 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
    expect(useCartStore.getState().total).toBe(500);
  });

  it('should ignore quantity updates less than 1', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    const item = createMockItem('1', 100);

    addItem(item);

    updateQuantity('1', 0);
    expect(useCartStore.getState().items[0].quantity).toBe(1); // Should remain 1

    updateQuantity('1', -1);
    expect(useCartStore.getState().items[0].quantity).toBe(1); // Should remain 1
  });
});
