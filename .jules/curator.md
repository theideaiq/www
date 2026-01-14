## 2025-02-18 - Co-location of Internationalization Logic

Structure: Internationalization routing logic (`navigation.ts`) is now co-located with `request.ts` in `src/i18n/`.
Rule: Files that are tightly coupled by domain logic (like `next-intl` configuration and routing) should reside in the same directory, rather than being split between root `src/` and subdirectories.

## 2025-02-19 - Grouping Admin Shell Components

Structure: `AdminShell` and `Sidebar` are now grouped in `src/components/shell/`.
Rule: Top-level layout components (like shell, sidebar, header) should be grouped in a dedicated directory (e.g., `shell/` or `layout/`) to declutter the components root and indicate their high-level role.
