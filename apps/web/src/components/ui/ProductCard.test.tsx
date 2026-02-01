import { render, screen } from '@testing-library/react';
import type { Product } from '@/services/products';
import { ProductCard } from './ProductCard';

// Mock Product
const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  slug: 'test-product',
  price: 1000,
  category: 'Test',
  condition: 'new',
  seller: 'Test Seller',
  rating: 4.5,
  image: '/test.jpg',
  images: [],
  isVerified: true,
  description: 'Test Description',
  details: {},
  variants: [],
  stock: 10,
};

// Mock Next.js and Framer Motion
vi.mock('next/image', () => ({
  // biome-ignore lint/suspicious/noExplicitAny: Mock component
  // biome-ignore lint/performance/noImgElement: Mock component
  // biome-ignore lint/a11y/useAltText: Mock component
  default: ({ fill, priority, ...props }: any) => <img {...props} />,
}));

vi.mock('next/link', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('framer-motion', () => ({
  motion: {
    // biome-ignore lint/suspicious/noExplicitAny: Mock component
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
  },
}));

test('ProductCard "Add to cart" button becomes visible on focus', () => {
  render(<ProductCard product={mockProduct} />);
  const button = screen.getByLabelText('Add to cart');

  // Check that it has the focus-visible classes
  // Note: These expectations are designed to FAIL initially
  expect(button.className).toContain('focus-visible:opacity-100');
  expect(button.className).toContain('focus-visible:translate-y-0');
});
