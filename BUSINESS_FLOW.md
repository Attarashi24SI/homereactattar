# Attar24 App Business Flow Documentation

> Derived only from the existing source code, routing, services, API usage, static data files, and business logic.
> No assumptions were made beyond what the codebase contains.

## Overview

This application is a React + Vite web app for BrightWash laundry management. It contains:

- Guest landing page
- Authentication
- Member portal for placing laundry orders
- Admin panel for managing customers and orders
- Static/demo views for membership, payments, and order history
- Supabase REST API integration for user, customer, membership, products, orders, and tracking data

The main app entry point is `src/App.jsx`. Routes are protected by `src/components/RouteGuards.jsx` and session state is stored in `src/context/AuthContext.jsx`.

The app also includes legacy/demo modules under `src/Laporanp2`, `src/Laporanp3`, and `src/Laporanp4` which are not referenced by `src/App.jsx` and therefore are outside the current business flow.

---

## Overall System Flow

Customer
  ↓
Login / Register
  ↓
Member Portal / Product Browse
  ↓
Create Order
  ↓
Create Order Items
  ↓
Create Order Tracking
  ↓
Track Order Status
  ↓
View Order History (Completed orders)
  ↓
Give Feedback (Rating 1-5 + Comment)
  ↓
Feedback saved to database
  ↓
(Optional) Admin approves feedback as testimonial
  ↓
Approved feedback displayed on Landing Page as testimonial

Admin
  ↓
Login as Admin
  ↓
Dashboard / Customers / Orders
  ↓
View Order Details
  ↓
Update Order Status / Update Payment / Update Estimate
  ↓
Order Tracking entries created
  ↓
(New) Review Customer Feedback — Approve/Reject for Landing Page testimonial

---

## Authentication

### Purpose

Allow admin and customer users to log in and establish session state.

### Entry Point

- Page: `/login`
- Component: `src/pages/auth/Login.jsx`
- API: `src/services/userAPI.js` ➜ `loginUser`
- Context: `src/context/AuthContext.jsx` ➜ `login`

### Workflow

1. User enters `username` and `password` in `Login.jsx`.
2. `Login.jsx` calls `userAPI.loginUser({ username, password })`.
3. If the response returns at least one row, it takes the first row and extracts `role`.
4. `AuthContext.login(username, role)` is invoked.
   - If `role === 'admin'`, session stores `{ username, role: 'admin' }`.
   - Otherwise, it treats the user as customer.
5. For customer login, `AuthContext.login`:
   - calls `customerAPI.fetchCustomerByUsername(username)`
   - if a customer record exists, calls `customerAPI.fetchMembershipByCustomerId(customer.customerid)`
   - stores session user with customer data, membership data, and role `customer`
6. Session state is persisted in `localStorage` as `brightwash_user`.
7. Redirects:
   - admin → `/dashboard`
   - customer → `/member-portal`

### Tables Used

- `user` (Supabase `user` table)
- `customer` (Supabase `customer` table)
- `membership` (Supabase membership endpoint via `customerAPI`)

### Validation

- `Login.jsx` does not perform field validation beyond required submission.
- `userAPI.loginUser` queries username/password equality directly.

### Output

- UI updates: redirect to appropriate dashboard and show authenticated state
- Database: read-only on login
- API response: array of user rows from `user` table

### Notes

- Authentication is client-side session state only.
- No token exchange or real authorization header flow is implemented.
- The login flow is based on role detection from the `user` table.

---

## Member Registration

### Purpose

Register new laundry customers and create both customer profile and user credentials.

### Entry Point

- Page: `/register`
- Component: `src/pages/auth/Register.jsx`
- APIs:
  - `customerAPI.createCustomer`
  - `userAPI.registerUser`

### Workflow

1. User fills registration form fields:
   - `fullname`
   - `username`
   - `email`
   - `gender`
   - `birthDate`
   - `password`
   - `confirmPassword`
2. Client-side validation in `Register.jsx`:
   - required fields must be filled
   - password and confirm password must match
   - password must be at least 6 characters
3. Duplicate checks:
   - `userAPI.checkUsernameExists(username)`
   - `userAPI.checkEmailExists(email)`
4. If both are unique, generate `createdCustomerId = CUST<last6digitsOfTimestamp>`.
5. Create customer record through `customerAPI.createCustomer(...)` in table `customer`.
6. Create corresponding user credential through `userAPI.registerUser(...)` in table `user`.
7. If user registration fails, attempt rollback by deleting the created customer record.
8. On success, show success alert and navigate to `/login`.

### Tables Used

- `customer` (created in Supabase)
- `user` (created in Supabase)

### Business Logic

- New customer default `plan` is always `Silver`.
- `customerid` is derived from timestamp.
- `user.role` is hard-coded to `customer`.

### Output

- Database create operations in `customer` and `user`.
- UI updates: redirect to login, show alerts.

### Edge Cases

- User registration fails after customer insert: rollback attempted.
- No email format validation or password strength enforcement beyond length.
- `checkUsernameExists` and `checkEmailExists` rely on Supabase REST query.
- If rollback delete fails, inconsistent state may remain.

---

## Customer Management

### Purpose

Admin can view and create customers.

### Entry Point

- Page: `/customers`
- Component: `src/pages/Customers.jsx`
- API: `customerAPI.fetchCustomers`, `customerAPI.createCustomer`

### Workflow

1. `Customers.jsx` loads customer list using `customerAPI.fetchCustomers()`.
2. Display customers in `CustomerTable`.
3. Add new customer flow uses a dialog and `CustomerForm`.
4. On submit, if mandatory fields exist, a new `customerid` is generated and `customerAPI.createCustomer(...)` is called.
5. Success reloads list via `fetchData()`.

### Tables Used

- `customer`

### Validation

- `Customers.jsx` validates only that `fullname`, `username`, and `birthDate` are present.
- `plan` defaults to `SILVER` for admin-created customers.

### Output

- create customer in `customer` table
- UI: refresh customer list

### Limitations

- No edit or delete UI for customer records.
- `customerAPI.updateCustomer` exists but is unused.
- `customerAPI.deleteCustomer` is used only as rollback during registration.

---

## Contact Management

### Purpose

Not implemented in the active codebase.

### Evidence

- `src/assets/data/contact.json` exists as static data.
- No component or page references `contact.json`.
- There is no service or API call for `contact`.

### Status

- Unknown / not implemented.
- If used, it would be a static asset only.

---

## Products

### Purpose

Allow members to browse laundry service products.

### Entry Point

- Page: `/member-portal`
- Component: `src/pages/MemberPortal.jsx`
- API: `laundryPortalAPI.fetchServices`

### Workflow

1. MemberPortal loads service list from `laundryPortalAPI.fetchServices()`.
2. If the API call fails, it falls back to `FALLBACK_SERVICES` embedded in `laundryPortalAPI.js`.
3. Member selects service items and adds them to cart.
4. Cart quantity updates and removal are handled locally.

### Tables Used

- `products` (Supabase `products` table) via `laundryPortalAPI.fetchServices`

### Business Logic

- Service categories are derived from `service.category`.
- The UI supports filtering by category.
- Cart management is local state only.

### Output

- UI rendering of catalog and cart
- No direct database update until checkout

### Notes

- `ServicesPricing.jsx` is a separate table view using `src/Laporanp4/data/data.json` and is unrelated to the catalog API.
- This page appears to be static/demo and not connected to the actual Supabase `products` service.

---

## Orders

### Purpose

Create orders for a member and allow admin management.

### Member Order Creation

#### Entry Point

- Page: `/member-portal`
- Action: `handleCheckout` in `src/pages/MemberPortal.jsx`
- API: `laundryPortalAPI.createOrder`

#### Workflow

1. Member selects items into cart.
2. Member chooses pickup method (default `Drop Off`).
3. `handleCheckout` checks if cart has items.
4. It calls `laundryPortalAPI.createOrder({ user, cart, pickupMethod })`.

#### Business Logic in `laundryPortalAPI.createOrder`

- Determine profile identifier:
  - If `user.customerid` looks like a UUID, use it as profile ID.
  - Otherwise, call `ensureProfile(user)`.
- `ensureProfile(user)`:
  - if `profiles.id` exists based on `user` already, use it
  - otherwise query `profiles?customerid=eq.<customerid>`
  - if no profile exists, create one with:
    - `id: crypto.randomUUID()`
    - `customerid: user.customerid`
    - `full_name`
    - `points: 0`
    - `tier: user.plan || 'Silver'`
- Generate `totalAmount` from cart item prices and quantities.
- Determine discount rate by tier:
  - platinum → 20%
  - gold → 15%
  - else → 10%
- Calculate `discountApplied`, `finalAmount`, `pointsEarned = Math.floor(finalAmount / 10000)`.
- Determine `estimatedFinish` using the slowest cart item duration.
- Generate `invoiceNumber` like `BW-<YYYYMMDD>-<RANDOM>`.
- Create `orders` record with fields including:
  - `user_id`
  - `total_amount`, `discount_applied`, `final_amount`, `points_earned`
  - `status: Pending`
  - `invoice_number`
  - `service_type`
  - `pickup_method`
  - `estimated_finish`
  - `payment_status: Unpaid`
  - `current_step: Pending`
- Create `order_items` entries for each cart item.
- Create initial `order_tracking` row with status `Pending`.

#### Tables Used

- `profiles`
- `orders`
- `order_items`
- `order_tracking`
- `products` indirectly via cart data

#### Output

- Inserts into `orders`, `order_items`, `order_tracking`
- Redirect member to `/tracking/<invoice_number>`
- Local cart is cleared

#### Edge Cases

- If `user` has no `customerid`, `ensureProfile` fails.
- `pointsEarned` is stored on the order, but no profile points aggregation is updated.
- `tier` is derived from `user.plan` and not recalculated.

### Admin Order Management

#### Entry Point

- Page: `/orders`
- Component: `src/pages/Orders.jsx`
- API: `adminOrdersAPI.fetchAdminOrders`

#### Workflow

1. Admin page fetches orders via `adminOrdersAPI.fetchAdminOrders()`.
2. API query includes embedded relations:
   - `order_items(*,products(*))`
   - `order_tracking(*)`
   - `profiles!orders_user_id_fkey(full_name,customerid)`
3. Orders are filtered and searched in the UI.
4. Admin can open `/orders/:id`.

#### Order Detail Actions

- Page: `src/pages/OrdersDetail.jsx`
- APIs:
  - `adminOrdersAPI.updateOrderStatus`
  - `adminOrdersAPI.updatePaymentStatus`
  - `adminOrdersAPI.updateEstimatedFinish`

#### Update Status Logic

- Validate `orderId` and `status`.
- Patch `orders` record with `current_step`, `status`, `updated_at`.
- Insert `order_tracking` row with `updated_by` and status details.

#### Update Payment Logic

- Validate `orderId` and `paymentStatus`.
- Patch `orders.payment_status` and `updated_at`.

#### Update Estimate Logic

- Validate `orderId`.
- Patch `orders.estimated_finish` and `updated_at`.

#### Tables Used

- `orders`
- `order_items`
- `products`
- `order_tracking`
- `profiles`

#### Output

- Database patch updates to orders and tracking
- UI shows success/error notification

### Notes

- The admin order list and detail use actual Supabase API data.
- Order detail page supports status and payment updates.
- `order_items` are created during member checkout; admin can view them but not directly edit them from current UI.

---

## Order Items

### Purpose

Store ordered service items linked to each order.

### Entry Point

- Created by `laundryPortalAPI.createOrder`.

### Workflow

1. After order insert, `createOrder` posts order items to `/order_items`.
2. Each item contains:
   - `order_id`
   - `product_id`
   - `quantity`
   - `price`

### Tables Used

- `order_items`

### Output

- order items are persisted and later loaded by admin order queries

### Notes

- No direct UI exists for editing order items.

---

---

## Order Feedback & Customer Review

### Purpose

Allow customers to give ratings and reviews for completed orders. Approved feedback serves as testimonials on the Landing Page.

### Entry Point

- Page: `/history`
- Component: `src/pages/History.jsx`
- Form: `src/components/FeedbackForm.jsx` (dialog modal)
- APIs:
  - `laundryPortalAPI.createFeedback`
  - `laundryPortalAPI.fetchFeedbackByOrder`
  - `laundryPortalAPI.fetchFeedbackForOrders` (bulk)
  - `laundryPortalAPI.fetchApprovedTestimonials`
  - `adminOrdersAPI.approveFeedback`

### Workflow

1. Member navigates to `/history` which lists orders where `current_step === "Completed"`.
2. For each completed order, the system fetches existing feedback via `fetchFeedbackForOrders`.
3. If no feedback exists, a **"Beri Ulasan"** button is shown.
4. Clicking the button opens `FeedbackForm` dialog with:
   - 5-star rating (interactive hover + click)
   - Optional comment textarea (max 1000 chars)
   - Submit button with loading state
5. On submit, `createFeedback` is called which:
   - Validates user profile exists
   - Validates rating (1-5, required)
   - Validates order ownership (user_id match)
   - Validates order status is "Completed"
   - Checks feedback doesn't already exist (duplicate prevention)
   - Creates feedback record in Supabase `feedback` table
6. After successful submission, History refreshes and shows:
   - Star rating display
   - Comment (truncated)
   - Feedback date
   - "Sudah Diulas" badge (replaces "Beri Ulasan" button)

### Tables Used

- `feedback` (created in Supabase)
- `orders` (validated for ownership and status)
- `profiles` (for user_id mapping)

### Business Logic

- `createFeedback` performs server-side validation before saving:
  - Checks order belongs to the logged-in user
  - Checks `current_step === "Completed"`
  - Checks no existing feedback for the same order
- Database-level unique index `idx_feedback_order_id` on `order_id` prevents duplicate entries
- New feedback always starts with `is_approved: false`

### Output

- Database: insert into `feedback` table
- UI: History page shows submitted feedback with stars, comment, date, and "Sudah Diulas" badge

### Edge Cases

- Attempting to submit feedback twice for the same order: blocked by server validation + DB unique index
- Attempting to give feedback on non-Completed order: blocked by server validation
- Attempting to give feedback on another member's order: blocked by server validation
- Empty comment: allowed (comment is optional)
- No feedback yet for any completed order: "Beri Ulasan" button shown for each

---

## Admin Feedback Approval

### Purpose

Allow admins to review customer feedback and approve/reject it for use as Landing Page testimonials.

### Entry Point

- Page: `/orders/:id` (Order Detail page)
- Component: `src/pages/OrdersDetail.jsx`
- API: `adminOrdersAPI.approveFeedback`

### Workflow

1. Admin opens order detail for a Completed order.
2. `OrdersDetail.jsx` fetches feedback via `laundryPortalAPI.fetchFeedbackByOrder(order.id)`.
3. If feedback exists, a **"Ulasan Pelanggan"** section appears in the right sidebar showing:
   - Star rating
   - Comment text
   - Submission date
   - Testimonial status badge ("Menunggu" / "Disetujui")
4. For pending feedback (`is_approved: false`), admin can:
   - Click **"Setujui"** → sets `is_approved = true` → feedback appears on Landing Page
   - Click **"Tolak"** → keeps `is_approved = false` → feedback stays hidden from Landing Page
5. Success/error notifications are shown via inline message.

### Tables Used

- `feedback` (updated)
- `orders` (context only)

### Business Logic

- Only feedback with `is_approved = true` is shown on the Landing Page.
- Approved feedback can be toggled back to pending by clicking "Tolak" again.
- `updated_at` is automatically updated by the DB trigger.

### Output

- Database: patch `feedback.is_approved` and `feedback.updated_at`
- UI: status badge updates, confirmation message shown

---

## Landing Page Testimonials Integration

### Purpose

Display approved customer feedback as testimonials on the public Landing Page.

### Entry Point

- Page: `/` (Landing Page)
- Component: `src/pages/guest/Home.jsx`
- API: `laundryPortalAPI.fetchTestimonials()`

### Workflow

1. Landing Page calls `fetchTestimonials()` on mount.
2. `fetchTestimonials()` delegates to `fetchApprovedTestimonials()` which:
   - Queries `feedback` table where `is_approved = true`
   - Joins `profiles` to get customer name (`profiles.full_name`)
   - Maps result to `{ id, name, rating, text, created_at }` format
   - If no approved feedback exists or API fails, falls back to `FALLBACK_TESTIMONIALS`
3. Testimonials are displayed in the existing carousel component with:
   - Star rating
   - Comment text
   - Customer name
   - Auto-rotate, pagination dots, navigation arrows

### Tables Used

- `feedback` (read, filtered by `is_approved = true`)
- `profiles` (joined for customer name)

### Business Logic

- Only feedback with `is_approved = true` is displayed
- Falls back to hardcoded `FALLBACK_TESTIMONIALS` when no approved feedback exists
- The existing testimonial carousel UI is unchanged

### Output

- UI: testimonial carousel cards on Landing Page

---

## Order Tracking

### Purpose

Track order status progression for admin and customers.

### Entry Point

- Initial tracking row created in `laundryPortalAPI.createOrder`
- Additional tracking rows created in `adminOrdersAPI.updateOrderStatus`

### Workflow

1. On order creation, a `Pending` tracking row is inserted.
2. When admin updates an order status, a new `order_tracking` row is inserted.
3. Customer-facing pages load tracking entries from `laundryPortalAPI.fetchOrders` or `fetchOrderByInvoice`.

### Tables Used

- `order_tracking`

### Output

- Tracking timeline on `/tracking/:invoice`
- Status progress bars on member and admin screens

### Notes

- Tracking is derived from `order_tracking` and `orders.current_step`.
- `updated_by` is set from admin ID if available.
- `order_tracking.updated_by` relation is only marked as "Verify Foreign Key" in schema because code assumes it may be a `profiles.id`.

---

## Customer Interaction

### Purpose

Customer interaction feature is not implemented in the active app.

### Evidence

- No page references `interaction`.
- No service queries or APIs for interaction.
- No `interaction` table usage in code.

### Status

Unknown / not implemented.

---

## Points & Tier System

### Purpose

Calculate discount tier and points earned for members.

### Entry Point

- Member portal checkout uses `user.tier || user.plan`.
- Points are calculated at order creation in `laundryPortalAPI.createOrder`.

### Workflow

1. Determine `tier` from user session:
   - `user.tier` if present
   - otherwise `user.plan`
2. Map tier to discount:
   - `platinum` → 0.20
   - `gold` → 0.15
   - else → 0.10
3. Compute `discountApplied = Math.round(subtotal * discountRate)`.
4. Compute `finalAmount = subtotal - discountApplied`.
5. Compute `pointsEarned = Math.floor(finalAmount / 10000)`.
6. Persist `points_earned` on the order.

### Tables Used

- `profiles` (tier info)
- `orders` (points_earned)

### Output

- Order-level `points_earned`
- Customer-facing display of reward points in tracking and history pages

### Limitations

- Member points are not aggregated back into `profiles.points`.
- Tier changes are not recalculated automatically after order completion.
- The code assumes tier discount only, not a full loyalty program.

---

## Member Portal

### Purpose

Allow logged-in customers to browse services, add items to cart, and submit orders.

### Entry Point

- Route: `/member-portal`
- Component: `src/pages/MemberPortal.jsx`

### Workflow

1. The page requires authentication via `MemberRoute`.
2. It loads services from `laundryPortalAPI.fetchServices()`.
3. Service selection and cart management happen in local component state.
4. Checkout triggers `laundryPortalAPI.createOrder`.

### Related Components

- `src/components/PageHeader.jsx`
- `src/components/MetricCard.jsx`
- `src/components/Badge.jsx` (UI only)

### Output

- Member order is created and user is redirected to tracking.

### Notes

- `services` are dynamic from API, but may fall back to static data.
- The portal includes tier/discount details and calculates final totals locally.

---

## Admin Dashboard

### Purpose

Present a summary of orders and metrics to admin users.

### Entry Point

- Route: `/dashboard`
- Component: `src/pages/Dashboard.jsx`

### Workflow

1. Dashboard loads static data from `src/assets/data/order.json`, `customer.json`, and `payment.json`.
2. It computes counts and revenue metrics from static arrays.
3. Charts are drawn from local `ordersData` only.

### Tables Used

- None. The current dashboard uses static local assets.

### Output

- UI summary cards and charts

### Notes

- This page does not use the live Supabase orders API.
- It is effectively a static dashboard overlay on sample data.

---

## Other Important Findings

### Static/Legacy Data Usage

These files are used by UI pages but are not live API data:

- `src/assets/data/order.json` used by `Dashboard.jsx`, `CustomersDetail.jsx`, `OrderHistory.jsx`
- `src/assets/data/customer.json` used by `Dashboard.jsx`, `Membership.jsx`, `CustomersDetail.jsx`
- `src/assets/data/payment.json` used by `Dashboard.jsx`, `Payments.jsx`
- `src/assets/data/membership.json` used by `Membership.jsx`
- `src/Laporanp4/data/data.json` used by `ServicesPricing.jsx`

### Unused / Dead Code

- `src/services/notesAPI.js` is defined but not referenced by any route or component.
- `src/assets/data/contact.json` is present but unused.
- No `interaction` page or service is implemented.
- `src/pages/CustomersDetail.jsx` uses static assets rather than live API data.
- `src/pages/Payments.jsx`, `src/pages/OrderHistory.jsx`, and `src/pages/Membership.jsx` use local JSON data, not Supabase API.
- `src/Laporanp2`, `src/Laporanp3`, and `src/Laporanp4` are not connected to `src/App.jsx`.
- `customerAPI.updateCustomer` exists but is not used in UI.

### Missing / Partial Features

- Contact Management is not implemented.
- Customer Interaction is not implemented.
- Points/Tier system is recorded at order level only; profile update is missing.
- Membership admin view is static and not synchronized with live membership API.
- Order history and payments are static demo pages.

### Potential Database Inconsistencies

- The database schema includes a legacy `order` table that is not used by current order creation logic.
- The app uses Supabase `orders`, while the schema also defines `order` and `order_items` separately.
- `profiles.customerid` and `user.customerid` are linked to `customer.customerid`, but data consistency depends on correct client-side creation.
- `order_tracking.updated_by` is treated as `profiles.id`, but verification is required.
- `contact.customerId`, `interaction.customerId`, and `profiles.customerid` relationships are logical, not enforced in code.
- `feedback.user_id` references `profiles.id` — verified via foreign key constraint in migration.
- `feedback.order_id` references `orders.id` — verified via foreign key constraint in migration.

### Missing Validations

- Registration lacks email format validation.
- Login and registration are not protected against empty or malformed values beyond simple checks.
- Admin order updates do not enforce valid status transitions.
- `handleCheckout` does not validate `pickupMethod` values.
- `createOrder` does not verify the presence of valid product IDs beyond cart item data.

---

## Recommendations for Improvement

1. Centralize API headers and base URL configuration.
2. Replace hard-coded Supabase API keys in client-side code.
3. Use real auth tokens instead of storing role-based user state in `localStorage`.
4. Clean up static/demo-only pages or integrate them with live API data.
5. Implement customer edit/delete workflows if needed.
6. Add real contact and interaction modules or remove schema references.
7. Persist profile point totals and tier updates in `profiles` after order completion.
8. Standardize `order` vs `orders` table usage and remove legacy artifacts.
9. Add server-side or stricter client-side validation for form input and order updates.
10. Add a proper notification integration if page `Notifications.jsx` should reflect live events.

---

## Summary of Verified Modules

| Module | Implemented | Notes |
|---|---|---|
| Authentication | Yes | `Login.jsx`, `AuthContext.jsx`, `userAPI.js` |
| Member Registration | Yes | `Register.jsx`, `customerAPI.createCustomer`, `userAPI.registerUser` |
| Customer Management | Partially | `Customers.jsx` can list/create customers; detail page uses static data |
| Contact Management | No | Only unused static asset `contact.json` |
| Products | Yes | `MemberPortal.jsx` via `laundryPortalAPI.fetchServices()` |
| Orders | Yes | Member checkout and admin order management via Supabase |
| Order Items | Yes | Created during checkout, viewed in admin order detail |
| Order Tracking | Yes | Created during checkout, extended on admin status update |
| **Order Feedback & Customer Review** | **Yes** | `History.jsx`, `FeedbackForm.jsx`, `laundryPortalAPI`, `adminOrdersAPI.approveFeedback` |
| **Landing Page Testimonials** | **Yes** | `fetchApprovedTestimonials()` with fallback, admin approval required |
| Customer Interaction | No | Not implemented |
| Points & Tier | Partially | Calculated on order creation, not aggregated back to profile |
| Member Portal | Yes | `MemberPortal.jsx`, `TrackingStatus.jsx`, `TrackingDetail.jsx`, `History.jsx` |
| Admin Dashboard | Partially | `Orders` and `OrdersDetail` are live; `Dashboard` is static demo data |

---

## Notes on Unused Schema Tables

The following tables appear in the provided schema but are not exercised by active UI code:

- `contact`
- `interaction`
- `order` (legacy)
- `profiles` is used indirectly, but membership dashboard uses static data instead of direct API reads
- `feedback` — **active**, used by Order Feedback & Customer Review feature
  - Stores customer ratings and reviews for completed orders
  - Approvals managed by admin via Orders Detail page
  - Approved feedback feeds into Landing Page testimonials

---

## Conclusion

The current codebase supports login, customer registration, product browsing, member order creation, and admin order management. Several modules remain partially stubbed or demo-only, especially membership reporting, payments, contact management, and customer interaction.

The documented flow is based strictly on current source code and does not infer behavior outside of implemented routes and services.
