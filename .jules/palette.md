## 2026-01-07 - Input Component Accessibility
**Learning:** Screen readers require explicit association between inputs and their error messages. Merely rendering the error text near the input is insufficient for non-visual users to know the input is invalid or what the error is.
**Action:** When creating form inputs, always generate a unique ID for the error message, add `aria-invalid` to the input when in an error state, and link them using `aria-describedby`.
