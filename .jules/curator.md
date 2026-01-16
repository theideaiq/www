## 2025-02-18 - Co-location of Internationalization Logic

Structure: Internationalization routing logic (`navigation.ts`) is now co-located with `request.ts` in `src/i18n/`.
Rule: Files that are tightly coupled by domain logic (like `next-intl` configuration and routing) should reside in the same directory, rather than being split between root `src/` and subdirectories.

## 2025-02-18 - Component Bundling in UI Package

Structure: UI Components (e.g., `Button`, `Modal`) are now grouped into their own directories (e.g., `src/button/`, `src/modal/`) containing the component, tests, and stories.
Rule: Do not leave flat component files in the root of `packages/ui/src/`. Create a folder for each component to co-locate related assets.
