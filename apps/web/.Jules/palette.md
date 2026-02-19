## 2025-10-27 - Inconsistent Form Accessibility
**Learning:** Found that `Select` component lacked accessibility attributes (`aria-invalid`, `aria-describedby`) and required indicators present in `Input`.
**Action:** When working on form components, cross-reference `Input` implementation to ensure consistency in accessibility patterns.

## 2025-05-20 - Mobile Visibility for Hover Actions
**Learning:** "Quick Add" buttons relying on `group-hover:opacity-100` are completely inaccessible on touch devices where hover is unreliable or nonexistent.
**Action:** Always implement hover-reveal patterns mobile-first: visible by default (`opacity-100`), then hide on desktop (`lg:opacity-0`) and reveal on hover (`lg:group-hover:opacity-100`).
