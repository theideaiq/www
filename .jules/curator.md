## 2025-05-15 - Co-location of Package Tests
Structure: Unit tests for shared packages live inside the package (e.g., `packages/utils/src/*.test.ts`), not in consumer apps.
Rule: Shared packages must configure their own test runner (Vitest) and include tests in their tsconfig (for type checking) but exclude them from build output.
