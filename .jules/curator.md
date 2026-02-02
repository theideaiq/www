## 2024-05-23 - Co-location of Tests
Structure: Unit tests for packages must be located within the package itself, not in the consuming application.
Rule: `packages/*/src/*.test.ts` should be co-located with the source file (e.g., `string.ts` and `string.test.ts`).
