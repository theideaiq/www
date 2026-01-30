import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProductCard } from './ProductCard';

// Mocks
vi.mock('framer-motion', () => ({
  motion: {
    // biome-ignore lint/suspicious/noExplicitAny: Mocking external library props
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

vi.mock('next/link', () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mocking external library props
  default: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mocking external library props
  default: ({ src, alt, ...props }: any) => (
    // biome-ignore lint/performance/noImgElement: Mocking next/image with html img
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockProduct = {
  id: '1',
  title: 'Test Product',
  slug: 'test-product',
  price: 1000,
  category: 'Test',
  condition: 'new',
  seller: 'Test Seller',
  rating: 5,
  image: 'https://example.com/image.jpg',
  images: [],
  isVerified: true,
  description: 'Test Description',
  details: {},
  variants: [],
  stock: 10,
};

describe('ProductCard', () => {
  it('renders correctly and has hidden add-to-cart button', () => {
    render(<ProductCard product={mockProduct} />);

    const button = screen.getByLabelText('Add to cart');
    expect(button).toBeInTheDocument();

    // Check for hiding classes
    expect(button).toHaveClass('opacity-0');
    expect(button).toHaveClass('translate-y-12');

    // Check for accessibility classes (UX improvement)
    expect(button).toHaveClass('focus-visible:opacity-100');
    expect(button).toHaveClass('focus-visible:translate-y-0');
    expect(button).toHaveClass('focus-visible:ring-2');
  });
});
