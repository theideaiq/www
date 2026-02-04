import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';
import { CartDrawer } from './CartDrawer';

// Mock the stores
vi.mock('@/stores/cart-store', () => ({
  useCartStore: vi.fn(),
}));

vi.mock('@/stores/ui-store', () => ({
  useUIStore: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

// Mock Drawer component to render children immediately since it uses Portal
vi.mock('@/components/ui/Drawer', () => ({
  Drawer: ({ children, isOpen }: any) =>
    isOpen ? <div>{children}</div> : null,
}));

describe('CartDrawer Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cart items with accessible buttons', () => {
    // Setup mock state
    (useUIStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isCartOpen: true,
      closeCart: vi.fn(),
    });

    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [
        {
          id: 'item-1',
          title: 'Test Product',
          price: 1000,
          quantity: 2,
          image: '/test.jpg',
        },
      ],
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      total: 2000,
    });

    render(<CartDrawer />);

    // Check for buttons by their new accessible labels
    const removeButton = screen.getByLabelText('Remove item');
    expect(removeButton).toBeInTheDocument();

    const decreaseButton = screen.getByLabelText('Decrease quantity');
    expect(decreaseButton).toBeInTheDocument();

    const increaseButton = screen.getByLabelText('Increase quantity');
    expect(increaseButton).toBeInTheDocument();
  });
});
