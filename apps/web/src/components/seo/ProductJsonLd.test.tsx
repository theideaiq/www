import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProductJsonLd from './ProductJsonLd';
import type { Product } from '@/services/products';

const mockProduct: Product = {
  id: '123',
  title: 'Test Product',
  slug: 'test-product',
  price: 50000,
  stock: 10,
  rating: 4.5,
  reviewCount: 20,
  category: 'Gaming',
  condition: 'new',
  seller: 'Test Seller',
  image: 'https://example.com/image.jpg',
  images: [],
  isVerified: true,
  description: 'Test Description',
  details: {},
  variants: [],
};

describe('ProductJsonLd', () => {
  it('renders correct JSON-LD structure', () => {
    const { container } = render(<ProductJsonLd product={mockProduct} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).toBeInTheDocument();

    const json = JSON.parse(script!.innerHTML);
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('Product');
    expect(json.name).toBe('Test Product');
    expect(json.offers.price).toBe(50000);
    expect(json.offers.priceCurrency).toBe('IQD');
    expect(json.aggregateRating.ratingValue).toBe(mockProduct.rating);
    expect(json.aggregateRating.reviewCount).toBe(mockProduct.reviewCount);
  });

  it('renders out of stock availability', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    const { container } = render(<ProductJsonLd product={outOfStockProduct} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const json = JSON.parse(script!.innerHTML);
    expect(json.offers.availability).toBe('https://schema.org/OutOfStock');
  });

  it('omits aggregateRating if reviewCount is 0', () => {
    const noReviewsProduct = { ...mockProduct, reviewCount: 0 };
    const { container } = render(<ProductJsonLd product={noReviewsProduct} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const json = JSON.parse(script!.innerHTML);
    expect(json.aggregateRating).toBeUndefined();
  });
});
