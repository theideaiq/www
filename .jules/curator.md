## 2026-01-25 - Co-located Tests
Structure: Tests for shared packages must be located within the package itself, not in the consuming application.
Rule: Test files (*.test.ts) must be co-located with the source file they test (e.g., src/string.ts -> src/string.test.ts) inside the package.
