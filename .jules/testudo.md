## 2024-03-24 - Missing Tests in Utility Package

Discovery: The `packages/utils` workspace contains critical string and formatting logic (`decodeHtmlEntities`, `slugify`, `formatCurrency`) but has ZERO tests. This logic is used by the main web app and could cause regressions if modified.

Strategy: Since `packages/utils` does not have a test runner configured and the current environment prevents easy installation of new dependencies (due to strict engine requirements), I will add a test file in `apps/web/src/lib/string-utils.test.ts`. This test file will import the functions from `@repo/utils` and verify their behavior. While ideally tests should be collocated with the code in `packages/utils`, this approach ensures the logic is verified using the existing `vitest` setup in `apps/web`.
