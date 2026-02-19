import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { vi, describe, it, expect } from 'vitest';
import type { Product } from '@/services/products';

// Mocks
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  slug: 'test-product',
  price: 1000,
  category: 'Test',
  seller: 'Test Seller',
  condition: 'new',
  rating: 4.5,
  image: '/test.jpg',
  images: [],
  isVerified: true,
  description: 'Test Description',
  details: {},
  variants: [],
  stock: 10,
};

describe('ProductCard', () => {
  it('renders rating with accessible label', () => {
    render(<ProductCard product={mockProduct} />);
    const rating = screen.getByRole('img', { name: /Rated 4.5 out of 5 stars/i });
    expect(rating).toBeInTheDocument();
  });

  it('renders quick add button with mobile visibility classes', () => {
    render(<ProductCard product={mockProduct} />);
    const button = screen.getByRole('button', { name: /Add to cart/i });

    // Check for mobile visibility classes
    // We check for the presence of the class names in the className attribute
    expect(button.className).toContain('opacity-100');
    expect(button.className).toContain('translate-y-0');

    // Check for desktop hidden classes
    expect(button.className).toContain('lg:opacity-0');
    expect(button.className).toContain('lg:translate-y-12');
  });
});
