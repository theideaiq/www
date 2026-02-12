
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addToCartDB } from './cart';
import * as supabaseClient from '@/lib/supabase/client';

// Mock the Supabase client
const mockGetUser = vi.fn();
const mockFrom = vi.fn();

const mockSupabase = {
  auth: {
    getUser: mockGetUser,
  },
  from: mockFrom,
};

// Mock createClient to return our mockSupabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

// Helper to create a chainable query builder mock
const createMockBuilder = (returnValue: any = {}) => {
  const builder: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(returnValue),
    // Make the builder thenable so it can be awaited directly (for insert/update chains)
    then: (resolve: any) => resolve(returnValue),
  };
  return builder;
};

describe('addToCartDB', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return false if user is not logged in', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const result = await addToCartDB('prod-123', 1);

    expect(result).toBe(false);
    expect(mockGetUser).toHaveBeenCalled();
  });

  it('should add new item to cart successfully', async () => {
    // 1. Mock User
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    // 2. Mock 'carts' query (getOrCreateCartId)
    // First call to .from('carts') -> .select()...single() returns cart
    const cartsBuilder = createMockBuilder({ data: { id: 'cart-123' } });

    // 3. Mock 'cart_items' query (check if item exists)
    // First call to .from('cart_items') -> .select()...single() returns null (not found)
    const checkItemsBuilder = createMockBuilder({ data: null });

    // 4. Mock 'cart_items' insert
    // Second call to .from('cart_items') -> .insert() returns success
    const insertItemsBuilder = createMockBuilder({ error: null });

    // Setup mockFrom implementation to return specific builders in order
    mockFrom
      .mockReturnValueOnce(cartsBuilder)      // from('carts') - get cart
      .mockReturnValueOnce(checkItemsBuilder) // from('cart_items') - check item
      .mockReturnValueOnce(insertItemsBuilder); // from('cart_items') - insert item

    const result = await addToCartDB('prod-123', 2);

    expect(result).toBe(true);

    // Verify Carts interaction
    expect(mockFrom).toHaveBeenNthCalledWith(1, 'carts');
    expect(cartsBuilder.select).toHaveBeenCalledWith('id');
    expect(cartsBuilder.eq).toHaveBeenCalledWith('user_id', 'user-123');

    // Verify Check Items interaction
    expect(mockFrom).toHaveBeenNthCalledWith(2, 'cart_items');
    expect(checkItemsBuilder.select).toHaveBeenCalledWith('id, quantity');
    expect(checkItemsBuilder.eq).toHaveBeenCalledWith('cart_id', 'cart-123');
    expect(checkItemsBuilder.eq).toHaveBeenCalledWith('product_id', 'prod-123');

    // Verify Insert interaction
    expect(mockFrom).toHaveBeenNthCalledWith(3, 'cart_items');
    expect(insertItemsBuilder.insert).toHaveBeenCalledWith({
      cart_id: 'cart-123',
      product_id: 'prod-123',
      quantity: 2,
    });
  });

  it('should update existing item quantity successfully', async () => {
    // 1. Mock User
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    // 2. Mock 'carts' query
    const cartsBuilder = createMockBuilder({ data: { id: 'cart-123' } });

    // 3. Mock 'cart_items' check -> returns existing item
    const checkItemsBuilder = createMockBuilder({
      data: { id: 'item-123', quantity: 5 }
    });

    // 4. Mock 'cart_items' update -> returns success
    // Update chain: .update(...).eq(...)
    const updateItemsBuilder = createMockBuilder({ error: null });

    mockFrom
      .mockReturnValueOnce(cartsBuilder)      // from('carts')
      .mockReturnValueOnce(checkItemsBuilder) // from('cart_items') - check
      .mockReturnValueOnce(updateItemsBuilder); // from('cart_items') - update

    const result = await addToCartDB('prod-123', 3);

    expect(result).toBe(true);

    // Verify Check Items interaction
    expect(checkItemsBuilder.single).toHaveBeenCalled();

    // Verify Update interaction
    expect(mockFrom).toHaveBeenNthCalledWith(3, 'cart_items');
    expect(updateItemsBuilder.update).toHaveBeenCalledWith({ quantity: 8 }); // 5 + 3
    expect(updateItemsBuilder.eq).toHaveBeenCalledWith('id', 'item-123');
  });

  it('should return false if database insert fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });

    // Cart exists
    const cartsBuilder = createMockBuilder({ data: { id: 'cart-123' } });

    // Item does not exist
    const checkItemsBuilder = createMockBuilder({ data: null });

    // Insert fails
    const insertItemsBuilder = createMockBuilder({ error: { message: 'DB Error' } });

    mockFrom
      .mockReturnValueOnce(cartsBuilder)
      .mockReturnValueOnce(checkItemsBuilder)
      .mockReturnValueOnce(insertItemsBuilder);

    const result = await addToCartDB('prod-123', 1);

    expect(result).toBe(false);
  });

  it('should return false if database update fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });

    // Cart exists
    const cartsBuilder = createMockBuilder({ data: { id: 'cart-123' } });

    // Item exists
    const checkItemsBuilder = createMockBuilder({
      data: { id: 'item-123', quantity: 1 }
    });

    // Update fails
    const updateItemsBuilder = createMockBuilder({ error: { message: 'DB Error' } });

    mockFrom
      .mockReturnValueOnce(cartsBuilder)
      .mockReturnValueOnce(checkItemsBuilder)
      .mockReturnValueOnce(updateItemsBuilder);

    const result = await addToCartDB('prod-123', 1);

    expect(result).toBe(false);
  });

  it('should return false if getting/creating cart fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });

    // Cart check fails (e.g., error finding and error creating)
    // getOrCreateCartId implementation:
    // 1. Check existing -> if null, proceed to create
    // 2. Create -> if error, return null

    const cartsCheckBuilder = createMockBuilder({ data: null }); // No existing cart

    const cartsInsertBuilder = createMockBuilder({ error: { message: 'Create failed' } }); // Create failed

    mockFrom
      .mockReturnValueOnce(cartsCheckBuilder) // Check existing
      .mockReturnValueOnce(cartsInsertBuilder); // Create new

    const result = await addToCartDB('prod-123', 1);

    expect(result).toBe(false);
  });
});
