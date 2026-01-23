## 2025-02-18 - Co-location of Package Tests
Smell: Unit tests for shared packages found in consuming applications (e.g., web testing utils).
Standard: Tests for shared packages must be co-located within the package itself (e.g., packages/utils/src/foo.test.ts) and run via the package's test script.
