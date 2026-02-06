import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductJsonLd from './ProductJsonLd';
import type { Product } from '@/services/products';

describe('ProductJsonLd', () => {
  const mockProduct: Product = {
    id: '1',
    title: 'Test Product',
    slug: 'test-product',
    price: 1000,
    category: 'Test',
    condition: 'new',
    seller: 'Test Seller',
    rating: 4.5,
    image: 'test.jpg',
    images: ['test.jpg', 'test2.jpg'],
    isVerified: true,
    description: 'Test Description',
    details: {},
    variants: [],
    stock: 10,
  };

  it('renders JSON-LD script with correct data', () => {
    const { container } = render(<ProductJsonLd product={mockProduct} />);
    const script = container.querySelector('script');

    expect(script).toBeTruthy();
    expect(script?.getAttribute('type')).toBe('application/ld+json');

    const json = JSON.parse(script?.innerHTML || '{}');

    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('Product');
    expect(json.name).toBe('Test Product');
    expect(json.description).toBe('Test Description');
    expect(json.image).toEqual(['test.jpg', 'test.jpg', 'test2.jpg']);
    expect(json.brand.name).toBe('Test Seller');
    expect(json.offers.price).toBe(1000);
    expect(json.offers.priceCurrency).toBe('IQD');
    expect(json.offers.itemCondition).toBe('https://schema.org/NewCondition');
    expect(json.offers.availability).toBe('https://schema.org/InStock');
  });

  it('handles out of stock and used condition', () => {
    const usedProduct = {
      ...mockProduct,
      condition: 'used',
      stock: 0,
    };

    const { container } = render(<ProductJsonLd product={usedProduct} />);
    const script = container.querySelector('script');
    const json = JSON.parse(script?.innerHTML || '{}');

    expect(json.offers.itemCondition).toBe('https://schema.org/UsedCondition');
    expect(json.offers.availability).toBe('https://schema.org/OutOfStock');
  });
});
