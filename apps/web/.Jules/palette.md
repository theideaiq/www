## 2025-10-27 - Inconsistent Form Accessibility
**Learning:** Found that `Select` component lacked accessibility attributes (`aria-invalid`, `aria-describedby`) and required indicators present in `Input`.
**Action:** When working on form components, cross-reference `Input` implementation to ensure consistency in accessibility patterns.

## 2025-05-23 - Drawer Accessibility
**Learning:** `Drawer` component was missing standard dialog accessibility traits (`role="dialog"`, `aria-modal`, `Escape` key listener), making it a trap for keyboard users.
**Action:** Ensure all overlay components implement `role="dialog"`, `aria-modal="true"`, and explicitly handle `Escape` key for closure.
