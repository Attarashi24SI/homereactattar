# BrightWash Member Portal Laundry Migration

This update migrates the member portal catalog from beauty products to laundry services while keeping the existing React/Vite structure and visual system.

## Database

Run these SQL files in Supabase:

1. `supabase_laundry_member_portal.sql`
2. `supabase_laundry_member_portal_seed.sql`

The migration extends existing `products` and `orders` tables and adds `order_tracking`. Existing columns are not removed.

## Member Routes

- `/member-portal` catalog, cart, and checkout
- `/tracking` order tracking list
- `/tracking/:invoice` tracking detail
- `/history` completed order history

Legacy member paths remain available:

- `/tracking-status`
- `/order-history`

## Implementation Notes

- Laundry services are read from Supabase `products` when available.
- A production-safe local fallback is included so the UI remains usable while migrations are being applied.
- Checkout inserts into `orders`, `order_items`, and the first `order_tracking` row with status `Pending`.
- Tracking history is append-only. Status changes should insert a new row in `order_tracking` rather than overwriting old tracking rows.
- Existing admin, CRM, customer management, auth, and dashboard modules were left outside this migration.

