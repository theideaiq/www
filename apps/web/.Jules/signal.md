## 2024-05-24 - Sitemap Synchronization
**Learning:** Found a discrepancy between `sitemap.ts` hardcoded routes and actual application routes (e.g., `/club` vs `/plus`). This causes crawling errors (404s).
**Action:** When creating new top-level pages or renaming routes, always check `sitemap.ts` and `robots.ts` to ensure they reflect the current site structure. Ideally, derive sitemap routes from a shared configuration like `@repo/config` if possible.

## 2025-02-18 - [Product Schema Missing Review Count]
**Learning:** The `Product` interface lacked `reviewCount`, preventing full `AggregateRating` schema implementation which is critical for Rich Snippets.
**Action:** Ensure core data interfaces include all fields required by Schema.org specifications, even if not used in the UI.
