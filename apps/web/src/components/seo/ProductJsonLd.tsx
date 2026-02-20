import type { Product } from '@/services/products';
import { safeJsonLdStringify } from '@repo/utils';

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
  const productUrl = `${baseUrl}/${locale}/product/${product.slug}`;

  // Map condition to Schema.org URL
  const itemCondition =
    product.condition?.toLowerCase() === 'new'
      ? 'https://schema.org/NewCondition'
      : 'https://schema.org/UsedCondition';

  // Ensure image is an array
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: images,
    description: product.description,
    sku: product.id,
    mpn: product.id, // Manufacturer Part Number
    brand: {
      '@type': 'Brand',
      name: product.seller || 'The IDEA',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'IQD',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition,
    },
    // Only include aggregateRating if valid
    ...(product.rating > 0 && product.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is safely escaped
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
    />
  );
}
