## 2024-05-24 - Test Co-location
Smell: Tests for shared packages (`@repo/utils`) were located in consuming apps (`apps/web`), causing circular dependencies and hidden failures.
Standard: Tests for shared packages must be co-located with the source code (e.g., `packages/utils/src/string.test.ts`) and executed via a package-level `test` script.
