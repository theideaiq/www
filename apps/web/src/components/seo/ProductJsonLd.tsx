import { webEnv } from '@repo/env/web';
import type { Product } from '@/services/products';

interface ProductJsonLdProps {
  product: Product;
  locale: string;
}

export default function ProductJsonLd({ product, locale }: ProductJsonLdProps) {
  const baseUrl = webEnv.NEXT_PUBLIC_SITE_URL;
  const productUrl = `${baseUrl}/${locale}/product/${product.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.length > 0 ? product.images : [product.image],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.seller || 'The IDEA',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'IQD',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: productUrl,
      itemCondition:
        product.condition?.toLowerCase() === 'new'
          ? 'https://schema.org/NewCondition'
          : 'https://schema.org/UsedCondition',
    },
  };

  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is safe and required by Google
      dangerouslySetInnerHTML={{ __html: safeJsonLd }}
    />
  );
}
