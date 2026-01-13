## 2024-02-14 - Inconsistent Style Merging
**Learning:** Found critical inconsistency in how UI components handle class merging. `Button` and `Input` use a robust `cn` utility (clsx + tailwind-merge) which allows safe class overrides, while `Select` and `Card` used hardcoded template literals, making them fragile and harder to extend.
**Action:** Always verify if a `cn` utility exists in the project before writing new components. If modifying existing ones, standardize on `cn` to prevent "specificity wars" and allow clean overrides (e.g. `className` props passed from parents should reliably override defaults).

## 2025-05-20 - Missing Brand Token for Deep Dark Backgrounds
**Learning:** Multiple components (`GlobalLoader`, `Footer`, `plus/page`, `megastore/page`) were hardcoding `#0f1014` as a background color. This color is slightly deeper than the configured `brand-dark` (`#0f172a`), creating a "magic number" dependency that makes theming inconsistent.
**Action:** Introduced `--color-brand-deep` (`#0f1014`) to the Tailwind theme config. Future dark-mode or "cinema-mode" backgrounds should use `bg-brand-deep` instead of hardcoded hex values or generic black.
