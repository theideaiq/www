import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductJsonLd } from './ProductJsonLd';
import { Product } from '@/services/products';

const mockProduct: Product = {
  id: 'test-id',
  title: 'Test Product',
  slug: 'test-product',
  price: 1000,
  category: 'Test Category',
  condition: 'new',
  seller: 'Test Seller',
  rating: 4.5,
  reviewCount: 10,
  image: 'test-image.jpg',
  images: ['test-image.jpg'],
  isVerified: true,
  description: 'Test description',
  details: {},
  variants: [],
  stock: 5,
};

describe('ProductJsonLd', () => {
  it('renders JSON-LD script correctly', () => {
    const { container } = render(<ProductJsonLd product={mockProduct} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();

    const content = JSON.parse(script?.textContent || '{}');
    expect(content['@type']).toBe('Product');
    expect(content.name).toBe('Test Product');
    expect(content.offers.price).toBe(1000);
    expect(content.aggregateRating.reviewCount).toBe(10);
  });
});
