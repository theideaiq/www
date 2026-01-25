# Architect's Journal

## 2025-05-15 - Standardized Currency Formatting
Smell: Inconsistent currency formatting (inline `Intl.NumberFormat` with varying options) across UI components.
Standard: Use `formatIQD` from `@repo/utils` for all IQD price displays. It enforces zero decimal places and `en-IQ` locale consistency.
