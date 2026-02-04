## 2026-02-04 - Standardize Currency Formatting
Smell: Multiple inline instantiations of `Intl.NumberFormat('en-IQ', ...)` across UI components causing duplication and potential inconsistency.
Standard: Use `formatPrice(amount)` from `@repo/utils` for all IQD price displays. This enforces `en-IQ` locale, decimal style, and zero fraction digits globally.
