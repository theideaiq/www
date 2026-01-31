## 2026-01-31 - IQD Currency Formatting
Smell: Multiple manual instantiations of `Intl.NumberFormat('en-IQ')` with inconsistent or repeated options across components.
Standard: Use `formatIQD` from `@repo/utils` for consistent Iraqi Dinar formatting (decimal style, 0 fraction digits).
