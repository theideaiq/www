## 2024-05-22 - [Optimization Pattern: Externalize Expensive Formatters]
**Learning:** Instantiating `Intl.NumberFormat` inside a component render loop (even in `CartDrawer`) causes significant object creation overhead on every render, especially when the list grows.
**Action:** Always instantiate `Intl` formatters outside the component scope or use `useMemo`, and extract list items into memoized components (`React.memo`) to isolate updates.

## 2024-05-22 - [Dev Environment Quirk: next-env.d.ts]
**Learning:** Running `next dev` locally modifies `apps/web/next-env.d.ts` to include `<reference types="./.next/dev/types/routes.d.ts" />`. This file change is transient and should not be committed.
**Action:** Always revert `apps/web/next-env.d.ts` before creating a PR to avoid CI build failures where that file might not exist.
