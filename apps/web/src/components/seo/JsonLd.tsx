export default function JsonLd({ baseUrl }: { baseUrl: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The IDEA',
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    description:
      "Innovation for Every Aspect of Life - Baghdad's premier digital ecosystem.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Baghdad',
      addressCountry: 'IQ',
    },
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
