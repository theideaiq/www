# Curator's Journal

## 2025-02-03 - Co-location of Utility Tests
Structure: Tests for shared utilities are now co-located with their source files in `packages/` rather than floating in consuming apps.
Rule: Any shared logic in `@repo/*` packages must have its tests located in the same package (e.g., `src/foo.ts` -> `src/foo.test.ts`), ensuring the package is self-contained and reliable.
