## 2025-10-27 - Inconsistent Form Accessibility
**Learning:** Found that `Select` component lacked accessibility attributes (`aria-invalid`, `aria-describedby`) and required indicators present in `Input`.
**Action:** When working on form components, cross-reference `Input` implementation to ensure consistency in accessibility patterns.

## 2025-02-24 - Hidden Interactive Elements
**Learning:** Interactive elements hidden via `opacity-0` (like "Quick Add" buttons) must be revealed on focus, otherwise they remain invisible to keyboard users even when focused.
**Action:** Always add `focus-visible:opacity-100` and reset transforms (e.g., `focus-visible:translate-y-0`) to hidden interactive elements to ensure Focus Visible compliance.
