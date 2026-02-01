## 2024-05-22 - Playwright Visibility & Tailwind Opacity
**Learning:** Playwright's `expect(locator).not_to_be_visible()` may strictly check `display: none` or `visibility: hidden` but can report `visible` for elements with `opacity: 0` in some Next.js/Tailwind configurations (possibly due to transitions or stacking contexts).
**Action:** When verifying opacity-based toggles (like hover effects), explicitly assert CSS properties using `expect(locator).to_have_css("opacity", "0")` instead of relying solely on `.not_to_be_visible()`.
