import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addToCartDB } from './cart';
import { createClient } from '@/lib/supabase/client';

// Mock dependencies
vi.mock('@/lib/supabase/client');
vi.mock('@repo/utils', () => ({
  Logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('Cart Service', () => {
  let mockSupabase: any;

  beforeEach(() => {
    // Setup the mock chain for Supabase
    mockSupabase = {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(),
    };

    (createClient as any).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('addToCartDB', () => {
    it('should return false if user is not authenticated', async () => {
      // Arrange
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      // Act
      const result = await addToCartDB('prod-123', 1);

      // Assert
      expect(result).toBe(false);
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it('should create a new cart and add item if no cart exists', async () => {
      // Arrange
      const userId = 'user-123';
      const productId = 'prod-123';
      const newCartId = 'cart-new';

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: userId } },
      });

      // Chain for checking existing cart (returns null)
      const mockSingleCart = vi.fn().mockResolvedValue({ data: null });
      const mockEqCart = vi.fn().mockReturnValue({ single: mockSingleCart });
      const mockSelectCart = vi.fn().mockReturnValue({ eq: mockEqCart });

      // Chain for creating new cart
      const mockSingleCreate = vi.fn().mockResolvedValue({ data: { id: newCartId }, error: null });
      const mockSelectCreate = vi.fn().mockReturnValue({ single: mockSingleCreate });
      const mockInsertCart = vi.fn().mockReturnValue({ select: mockSelectCreate });

      // Chain for checking existing item (returns null)
      const mockSingleItem = vi.fn().mockResolvedValue({ data: null });
      const mockEqItem2 = vi.fn().mockReturnValue({ single: mockSingleItem });
      const mockEqItem1 = vi.fn().mockReturnValue({ eq: mockEqItem2 });
      const mockSelectItem = vi.fn().mockReturnValue({ eq: mockEqItem1 });

      // Chain for inserting item
      const mockInsertItem = vi.fn().mockResolvedValue({ error: null });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'carts') {
          return {
            select: mockSelectCart,
            insert: mockInsertCart,
          };
        }
        if (table === 'cart_items') {
          return {
            select: mockSelectItem,
            insert: mockInsertItem,
          };
        }
        return {};
      });

      // Act
      const result = await addToCartDB(productId, 2);

      // Assert
      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('carts');
      expect(mockInsertCart).toHaveBeenCalledWith({ user_id: userId });
      expect(mockInsertItem).toHaveBeenCalledWith({
        cart_id: newCartId,
        product_id: productId,
        quantity: 2,
      });
    });

    it('should update quantity if item already exists', async () => {
      // Arrange
      const userId = 'user-123';
      const cartId = 'cart-123';
      const productId = 'prod-123';
      const existingItemId = 'item-1';
      const existingQty = 1;

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: userId } },
      });

      // Chain for checking existing cart (returns existing)
      const mockSingleCart = vi.fn().mockResolvedValue({ data: { id: cartId } });
      const mockEqCart = vi.fn().mockReturnValue({ single: mockSingleCart });
      const mockSelectCart = vi.fn().mockReturnValue({ eq: mockEqCart });

      // Chain for checking existing item (returns existing)
      const mockSingleItem = vi.fn().mockResolvedValue({
        data: { id: existingItemId, quantity: existingQty },
      });
      const mockEqItem2 = vi.fn().mockReturnValue({ single: mockSingleItem });
      const mockEqItem1 = vi.fn().mockReturnValue({ eq: mockEqItem2 });
      const mockSelectItem = vi.fn().mockReturnValue({ eq: mockEqItem1 });

      // Chain for updating item
      const mockUpdateItem = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'carts') {
          return { select: mockSelectCart };
        }
        if (table === 'cart_items') {
          return {
            select: mockSelectItem,
            update: mockUpdateItem,
          };
        }
        return {};
      });

      // Act
      const result = await addToCartDB(productId, 3);

      // Assert
      expect(result).toBe(true);
      expect(mockUpdateItem).toHaveBeenCalledWith({ quantity: existingQty + 3 });
    });

    it('should return false if database insert fails', async () => {
       // Arrange
       const userId = 'user-123';
       const cartId = 'cart-123';
       const productId = 'prod-123';

       mockSupabase.auth.getUser.mockResolvedValue({
         data: { user: { id: userId } },
       });

       // Existing cart
       const mockSingleCart = vi.fn().mockResolvedValue({ data: { id: cartId } });
       const mockEqCart = vi.fn().mockReturnValue({ single: mockSingleCart });
       const mockSelectCart = vi.fn().mockReturnValue({ eq: mockEqCart });

       // No existing item
       const mockSingleItem = vi.fn().mockResolvedValue({ data: null });
       const mockEqItem2 = vi.fn().mockReturnValue({ single: mockSingleItem });
       const mockEqItem1 = vi.fn().mockReturnValue({ eq: mockEqItem2 });
       const mockSelectItem = vi.fn().mockReturnValue({ eq: mockEqItem1 });

       // Insert fails
       const mockInsertItem = vi.fn().mockResolvedValue({ error: { message: 'DB Error' } });

       mockSupabase.from.mockImplementation((table: string) => {
         if (table === 'carts') return { select: mockSelectCart };
         if (table === 'cart_items') return { select: mockSelectItem, insert: mockInsertItem };
         return {};
       });

       // Act
       const result = await addToCartDB(productId, 1);

       // Assert
       expect(result).toBe(false);
    });
  });
});
