# Signal's Journal

## 2024-05-22 - Missing Structured Data for Organization
**Learning:** The root layout is missing `application/ld+json` Structured Data for the "Organization" entity. This prevents search engines from fully understanding the brand identity, logo, and official website association, which are crucial for the Knowledge Graph.
**Action:** Always check `layout.tsx` for a JSON-LD script block defining the `Organization` or `WebSite` schema. If missing, implement a `JsonLd` component to inject it.
