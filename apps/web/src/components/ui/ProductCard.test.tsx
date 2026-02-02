import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Product } from '@/services/products';
import { ProductCard } from './ProductCard';

// Mock Next.js components
vi.mock('next/image', () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mocking component props
  default: ({ fill, priority, ...props }: any) => (
    // biome-ignore lint/performance/noImgElement: Mock for testing
    <img {...props} alt={props.alt} />
  ),
}));

vi.mock('next/link', () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mocking component props
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
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
  image: 'https://example.com/image.jpg',
  images: [],
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
  });

  it('has accessible add to cart button', () => {
    render(<ProductCard product={mockProduct} />);
    const button = screen.getByRole('button', { name: /add to cart/i });
    expect(button).toBeInTheDocument();

    // Check for focus-visible classes which are needed for accessibility on hidden elements
    // This assertion fails before the fix
    expect(button.className).toContain('focus-visible:opacity-100');
    expect(button.className).toContain('focus-visible:translate-y-0');
  });
});
