'use client';

import { Product } from '@/services/products';
import { sanitizeJsonLd } from '@repo/utils';

interface ProductJsonLdProps {
  product: Product;
  baseUrl: string;
  locale: string;
}

export default function ProductJsonLd({
  product,
  baseUrl,
  locale,
}: ProductJsonLdProps) {
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images.length > 0 ? product.images : [product.image],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.seller || 'The IDEA',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/${locale}/product/${product.slug}`,
      priceCurrency: 'IQD',
      price: product.price,
      itemCondition:
        product.condition === 'new'
          ? 'https://schema.org/NewCondition'
          : 'https://schema.org/UsedCondition',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  if (product.reviewCount > 0) {
    // biome-ignore lint/suspicious/noExplicitAny: aggregateRating is conditional
    (productJsonLd as any).aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is sanitized
      dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(productJsonLd) }}
    />
  );
}
