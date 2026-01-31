# Testudo's Journal

## 2024-05-22 - [Cart Store Tests] Discovery: False Confidence
Discovery: The `cart-store.test.ts` file was testing an obsolete implementation (array of strings) instead of the actual `CartItem` object structure. This provided false confidence as the tests were logically disconnected from the actual code.
Strategy: rewritten tests to use strict mock objects matching the `CartItem` interface and verify state transitions (add, update, remove) against the actual Zustand store implementation.
