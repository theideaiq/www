## 2025-10-27 - Inconsistent Form Accessibility
**Learning:** Found that `Select` component lacked accessibility attributes (`aria-invalid`, `aria-describedby`) and required indicators present in `Input`.
**Action:** When working on form components, cross-reference `Input` implementation to ensure consistency in accessibility patterns.

## 2025-05-24 - Focus Visibility for Hidden Elements
**Learning:** Interactive elements hidden with `opacity-0` (like quick actions) are invisible to keyboard users unless explicitly revealed with `focus-visible:opacity-100`.
**Action:** Always pair `opacity-0` with `focus-visible:opacity-100` on interactive elements to ensure keyboard accessibility.
