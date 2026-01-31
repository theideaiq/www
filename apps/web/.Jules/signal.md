## 2024-05-24 - Sitemap Synchronization
**Learning:** Found a discrepancy between `sitemap.ts` hardcoded routes and actual application routes (e.g., `/club` vs `/plus`). This causes crawling errors (404s).
**Action:** When creating new top-level pages or renaming routes, always check `sitemap.ts` and `robots.ts` to ensure they reflect the current site structure. Ideally, derive sitemap routes from a shared configuration like `@repo/config` if possible.

## 2025-02-19 - Product Schema Gap
**Learning:** The Product Details Page (`/product/[slug]`) lacked JSON-LD Structured Data, making it harder for search engines to index price, availability, and reviews.
**Action:** Always implement `ProductJsonLd` component for e-commerce product pages, ensuring it maps internal `Product` interface fields to Schema.org properties (especially `offers` and `aggregateRating`).
