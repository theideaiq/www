import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from './ProductCard';
import type { Product } from '@/services/products';

// Mock Next.js primitives
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, priority, ...props }: any) => (
    <img src={src} alt={alt} {...props} data-priority={priority} />
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>
        {children}
      </div>
    ),
  },
}));

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  slug: 'test-product',
  price: 1000,
  category: 'Test',
  condition: 'new',
  seller: 'Test Seller',
  rating: 4.5,
  image: '/test-image.jpg',
  images: ['/test-image.jpg'],
  isVerified: true,
  description: 'Test Description',
  details: {},
  variants: [],
  stock: 10,
};

describe('ProductCard', () => {
  it('renders correctly', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Seller')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('has correct classes for Quick Add button (mobile first)', () => {
    render(<ProductCard product={mockProduct} />);
    const button = screen.getByLabelText('Add to cart');

    // Mobile First: Visible by default
    // It should NOT have opacity-0 as a base class (only lg:opacity-0)
    // toHaveClass checks for the exact class token.
    expect(button).not.toHaveClass('opacity-0');
    expect(button).not.toHaveClass('translate-y-12');

    // Desktop: Hidden by default
    expect(button).toHaveClass('lg:opacity-0');
    expect(button).toHaveClass('lg:translate-y-12');

    // Desktop Hover: Visible
    expect(button).toHaveClass('lg:group-hover:opacity-100');
    expect(button).toHaveClass('lg:group-hover:translate-y-0');

    // Accessibility
    expect(button).toHaveClass('focus-visible:opacity-100');
    expect(button).toHaveClass('focus-visible:translate-y-0');
  });
});
