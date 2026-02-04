## 2025-10-27 - Inconsistent Form Accessibility
**Learning:** Found that `Select` component lacked accessibility attributes (`aria-invalid`, `aria-describedby`) and required indicators present in `Input`.
**Action:** When working on form components, cross-reference `Input` implementation to ensure consistency in accessibility patterns.

## 2026-02-04 - Icon-only Button Accessibility in Drawers
**Learning:** Dense UI components like `CartDrawer` often rely on icon-only buttons that are invisible to screen readers without explicit `aria-label`s.
**Action:** Always check overlay components (Drawers, Modals) for icon-only buttons and enforce `aria-label` and `focus-visible` ring styles.
