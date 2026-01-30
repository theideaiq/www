## 2025-10-27 - Inconsistent Form Accessibility
**Learning:** Found that `Select` component lacked accessibility attributes (`aria-invalid`, `aria-describedby`) and required indicators present in `Input`.
**Action:** When working on form components, cross-reference `Input` implementation to ensure consistency in accessibility patterns.

## 2025-02-17 - Hidden Focusable Elements
**Learning:** `opacity-0` elements remain focusable but invisible to keyboard users, creating a confusing navigation experience.
**Action:** Always pair `opacity-0` + `hover:opacity-100` with `focus-visible:opacity-100` to ensure keyboard accessibility.
