## 2024-05-23 - Critical Gap in Cart Service Tests
Discovery: The `Cart` service (`apps/web/src/services/cart.ts`) contains critical business logic (`addToCartDB`, `fetchCartItems`) but lacks unit tests. This poses a high risk of regression for the checkout flow.
Strategy: Implement unit tests mocking the Supabase client to verify logic in isolation from the database. Use `vi.mock` for `@/lib/supabase/client` to return a chainable mock object.

## 2024-05-23 - Cart Store Mock Discrepancy
Discovery: `apps/web/src/stores/cart-store.test.ts` was testing a legacy implementation (array of strings) while the actual store used complex objects (`CartItem[]`). This caused tests to fail only when run, hiding the regression.
Strategy: When modifying state shapes (e.g., in Zustand), explicitly grep for and update associated test data fixtures.
