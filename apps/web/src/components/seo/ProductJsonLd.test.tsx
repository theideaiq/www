import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Product } from '@/services/products';
import { ProductJsonLd } from './ProductJsonLd';

// Mock webEnv
vi.mock('@repo/env/web', () => ({
  webEnv: {
    NEXT_PUBLIC_SITE_URL: 'https://test.com',
  },
}));

const mockProduct: Product = {
  id: '123',
  title: 'Test Product',
  slug: 'test-product',
  description: 'A test description',
  price: 1000,
  image: 'https://test.com/image.jpg',
  images: [],
  category: 'Test',
  condition: 'new',
  seller: 'Test Seller',
  rating: 4.5,
  isVerified: true,
  details: {},
  variants: [],
  stock: 10,
};

describe('ProductJsonLd', () => {
  it('renders valid JSON-LD', () => {
    const { container } = render(<ProductJsonLd product={mockProduct} />);
    const script = container.querySelector('script');
    expect(script).toBeDefined();
    expect(script?.type).toBe('application/ld+json');

    const json = JSON.parse(script?.innerHTML || '{}');
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('Product');
    expect(json.name).toBe('Test Product');
    expect(json.offers.price).toBe(1000);
    expect(json.offers.url).toBe('https://test.com/product/test-product');
    expect(json.aggregateRating.ratingValue).toBe(4.5);
  });
});
