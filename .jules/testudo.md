# Testudo's Journal

This journal tracks critical learnings regarding test architecture, reliability, and recurring patterns of failure.

## 2025-05-24 - Data Model Drift in Store Tests
Discovery: The `apps/web` Cart Store tests were completely broken because they tested a legacy string-based implementation, while the actual store had evolved to use complex `CartItem` objects. The tests were likely disabled or ignored, leading to a false sense of security.
Strategy: When refactoring state management (e.g., Zustand stores), always immediately update the corresponding tests. Use TypeScript interfaces (like `CartItem`) to create valid fixtures for testing instead of relying on primitives.

## 2025-05-24 - Improper Test Co-location
Discovery: Unit tests for the shared `@repo/utils` package (specifically `string.ts`) are currently located in `apps/web/src/lib/string-utils.test.ts`. This decouples the tests from the source, making it easy to miss regressions when modifying the utility package.
Strategy: Tests must be co-located with the source code they test (e.g., `packages/utils/src/string.test.ts`). Future refactoring should move these tests to the correct package.
