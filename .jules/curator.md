## 2025-02-13 - [Co-located Tests for Shared Packages]
Structure: Shared utility packages (e.g., `@repo/utils`) must contain their own test infrastructure and test files co-located with the source.
Rule: Do not place tests for shared library code inside consumer applications (e.g., `apps/web/src/lib`). Move them to the package itself.
