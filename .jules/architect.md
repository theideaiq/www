# Architect's Journal

## 2025-02-18 - [Feature Folders vs. Generic UI]
Smell: Domain-specific components (e.g., `ProductCard`) living in generic `components/ui` folders alongside atomic design elements like `Button` or `Modal`.
Standard: Components that are coupled to a specific business domain (e.g., Store, Checkout, User) must reside in feature-named directories (e.g., `components/store/ProductCard.tsx`). Generic `ui` folders are reserved for reusable, domain-agnostic primitives.
