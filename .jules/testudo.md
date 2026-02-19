## 2025-02-23 - [Shared Package Testing Mismatch]
Discovery: [Found existing tests for `@repo/utils` in `apps/web/src/lib/string-utils.test.ts` which were failing due to implementation drift (bugs in `slugify` and `decodeHtmlEntities`). The tests were not running as part of the package's CI/CD pipeline because they were misplaced in a consumer app.]
Strategy: [Enforce co-location of unit tests within the shared package directory (e.g., `packages/utils/src/string.test.ts`). Configure `vitest` in each shared package to ensure tests are run independently of consumers.]
