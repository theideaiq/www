# Palette's Journal

## 2024-05-22 - Accessibility Consistency in Form Fields
**Learning:** Found inconsistent accessibility patterns in form components. `Input` supported `aria-invalid` but `Textarea` and `Select` did not, creating a confusing experience for screen reader users who might miss error messages on some fields but not others.
**Action:** Always audit sibling components (like all form inputs) when one is found to have good a11y, to ensure the pattern is applied consistently across the design system.
