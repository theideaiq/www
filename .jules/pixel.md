## 2024-02-14 - Inconsistent Style Merging
**Learning:** Found critical inconsistency in how UI components handle class merging. `Button` and `Input` use a robust `cn` utility (clsx + tailwind-merge) which allows safe class overrides, while `Select` and `Card` used hardcoded template literals, making them fragile and harder to extend.
**Action:** Always verify if a `cn` utility exists in the project before writing new components. If modifying existing ones, standardize on `cn` to prevent "specificity wars" and allow clean overrides (e.g. `className` props passed from parents should reliably override defaults).

## 2025-05-20 - Missing Brand Token for Deep Dark Backgrounds
**Learning:** Multiple components (`GlobalLoader`, `Footer`, `plus/page`, `megastore/page`) were hardcoding `#0f1014` as a background color. This color is slightly deeper than the configured `brand-dark` (`#0f172a`), creating a "magic number" dependency that makes theming inconsistent.
**Action:** Introduced `--color-brand-deep` (`#0f1014`) to the Tailwind theme config. Future dark-mode or "cinema-mode" backgrounds should use `bg-brand-deep` instead of hardcoded hex values or generic black.

## 2025-05-21 - Semantic Link Styling
**Learning:** Detected invalid HTML nesting (`<Link><button>`) in `Navbar`, causing accessibility and hydration issues. This often happens when developers want a link to "look like a button" but use composition incorrectly.
**Action:** Do not nest `<button>` inside `<Link>`. Instead, apply button utility classes directly to the `<Link>` component or use `asChild` if using a UI library component that supports polymorphism.

## 2025-05-23 - Standardizing Overlay Styles
**Learning:** `Sheet` and `Modal` components used different overlay styles (`bg-black/80` vs `bg-black/60 backdrop-blur-sm`). This created visual inconsistency when switching between interaction patterns.
**Action:** Standardized on `bg-black/60 backdrop-blur-sm` for a more modern, consistent look across all overlay components. Also aligned close button interactions to use `hover:text-brand-pink`.
