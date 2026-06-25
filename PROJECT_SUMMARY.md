# Attar24 App (BrightWash Laundry Portal)

## Ringkasan Proyek

Aplikasi React + Vite untuk BrightWash laundry portal dengan:
- user auth (admin & member)
- member portal untuk browse layanan dan membuat order
- admin panel untuk memantau pelanggan dan order
- integrasi Supabase REST API untuk user, customer, membership, products, orders, dan tracking

## Teknologi Utama

- React 19
- Vite
- Tailwind CSS 4
- React Router DOM 7
- Axios
- Supabase REST API
- ESLint

## Cara Menjalankan

1. `npm install`
2. `npm run dev`
3. Buka `http://localhost:5173`

## Struktur Utama

- `src/App.jsx` — routing dengan pengelompokan route untuk guest, admin, dan member
- `src/main.jsx` — entry point React dan `BrowserRouter`
- `src/context/AuthContext.jsx` — login, logout, session `localStorage`
- `src/components/RouteGuards.jsx` — `AdminRoute`, `MemberRoute`, `AuthRequired`
- `src/services/` — API wrapper Supabase
- `src/pages/` — halaman aplikasi
- `src/assets/data/` — data demo dan fallback statis

## Routes Utama

- Guest: `/`
- Auth: `/login`, `/register`, `/forgot`
- Member: `/member-portal`, `/tracking`, `/tracking/:invoiceNumber`, `/history`, `/order-history`, `/services-pricing`
- Admin: `/dashboard`, `/customers`, `/customers/:id`, `/orders`, `/orders/:id`, `/payments`, `/membership`, `/notifications`

## API Service Utama

- `src/services/userAPI.js`
  - login user
  - register user
  - validasi username/email
- `src/services/customerAPI.js`
  - fetch customer by username
  - fetch membership by customerid
  - fetch semua customer
  - create/update/delete customer
- `src/services/laundryPortalAPI.js`
  - fetch services
  - fetchTestimonials — mengambil data testimonial dengan fallback
  - fetch member orders
  - fetch order by invoice
  - create order + insert order items + order tracking
  - fallback service dan testimonial data jika Supabase tidak tersedia
- `src/services/adminOrdersAPI.js`
  - fetch admin orders
  - fetch order detail
  - update order status
  - update payment status
  - update estimated finish

## Implementasi Utama

### Autentikasi

- `src/pages/auth/Login.jsx` memanggil `userAPI.loginUser`
- `AuthContext` menyimpan session ke `localStorage` dengan key `brightwash_user`
- login admin diarahkan ke `/dashboard`
- login customer memuat data `customer` dan `membership`, lalu diarahkan ke `/member-portal`

### Registrasi Member

- `src/pages/auth/Register.jsx` membuat customer baru di `customer` dan user baru di `user`
- `customerid` dibentuk dari timestamp
- `plan` default `Silver`
- jika pembuatan user gagal, customer yang sudah dibuat berusaha dihapus sebagai rollback

### Landing Page (Guest Home)

- `src/pages/guest/Home.jsx` — landing page public
- Menggunakan Tailwind utility classes (migrasi dari inline styles)
- Hero section, Services grid, Testimonial carousel, CTA, Footer
- Services dimuat via `fetchServices()` dengan skeleton loading
- Testimonials dimuat via `fetchTestimonials()` dengan skeleton loading
- Semua hover state menggunakan CSS Tailwind (bukan onMouseEnter/onMouseLeave)
- Google Fonts DM Sans + DM Serif Display via `index.html`
- Responsive: 3 card desktop, 2 tablet, 1 mobile

### Member Portal

- `src/pages/MemberPortal.jsx` memuat layanan dari `laundryPortalAPI.fetchServices()`
- Menggunakan komponen `ServiceCard` bersama (shared component) dengan variant="portal"
- halaman memproses cart lokal dan checkout
- checkout memanggil `laundryPortalAPI.createOrder`
- `createOrder` membuat record di `orders`, `order_items`, dan `order_tracking`

### Tracking & History

- `src/pages/TrackingStatus.jsx` memuat order member dari API
- `src/pages/TrackingDetail.jsx` memuat detail invoice dengan status tracking
- `src/pages/History.jsx` menampilkan order yang `current_step === 'Completed'`

### Admin Order Management

- `src/pages/Orders.jsx` memuat daftar order dari `adminOrdersAPI`
- `src/pages/OrdersDetail.jsx` bisa memperbarui status order, status pembayaran, dan estimasi selesai
- perubahan status menambah baris `order_tracking`

## Shared Components

- `src/components/ServiceCard.jsx` — digunakan oleh Landing Page (`variant="landing"`) dan Member Portal (`variant="portal"`)
  - Mengekspor `iconMap`, `colorGradientMap`, `colorTailwindMap` — menghilangkan duplikasi
- `src/components/ServiceCardSkeleton.jsx` — skeleton loading untuk services (dua varian)
- `src/context/SearchContext.jsx` — global search state untuk Header/admin pages
  - `SearchProvider` dipasang di `App.jsx` membungkus semua routes
  - `Header.jsx` search bar sudah fungsional (value, onChange, clear button)

## Halaman yang Saat Ini Statis / Demo

- `src/pages/Dashboard.jsx` menggunakan data demo dari `src/assets/data/*.json`
- `src/pages/CustomersDetail.jsx` menggunakan data statis, bukan API live
- `src/pages/Payments.jsx` menggunakan data statis
- `src/pages/Membership.jsx` menggunakan data statis
- `src/pages/OrderHistory.jsx` menggunakan data statis
- `src/pages/ServicesPricing.jsx` menggunakan `src/Laporanp4/data/data.json`
- `src/pages/Notifications.jsx` menampilkan notifikasi statis

## Catatan Implementasi

- `src/services/notesAPI.js` ada tapi tidak digunakan di aplikasi
- `src/assets/data/contact.json` tidak dipakai
- tidak ada halaman atau service untuk `interaction`
- `customerAPI.updateCustomer` ada tapi tidak dipanggil di UI
- beberapa modul di `src/Laporanp2`, `src/Laporanp3`, `src/Laporanp4` tidak terhubung ke `src/App.jsx`

## Catatan Keamanan

- Supabase API key ditulis langsung di beberapa file service
- Autentikasi hanya menggunakan session di `localStorage`
- Validasi form login/registrasi sederhana saja

## Database Schema (Ringkas)

### Tables

| Table | Primary Key | Keterangan |
|---|---|---|
| contact | contactId | data kontak customer (tidak digunakan)
| customer | customerid | profil pelanggan
| interaction | interactionId | catatan interaksi customer (tidak digunakan)
| order | orderId | legacy order table (tidak dipakai)
| order_items | id | item order (dipakai oleh checkout)
| order_tracking | id | status tracking order
| orders | id | order laundry utama
| products | id | daftar layanan laundry
| profiles | id | profil loyalty / tier
| user | uid | akun login

### Relationships Penting

- `user.customerid` → `customer.customerid`
- `orders.user_id` → `profiles.id`
- `order_items.order_id` → `orders.id`
- `order_items.product_id` → `products.id`
- `order_tracking.order_id` → `orders.id`

## Business Flow Singkat

1. Guest membuka landing page atau masuk/registrasi.
2. Member baru daftar, membuat `customer` dan `user`.
3. Member login, sistem memuat profil dan membership.
4. Member memilih layanan di `MemberPortal`.
5. Checkout membuat order, item, dan tracking.
6. Member memantau status di `TrackingStatus` / `TrackingDetail`.
7. Admin melihat daftar order dan memperbarui status/pembayaran.

## Ringkasan Kesesuaian Kode

- Fitur live: autentikasi, registrasi customer, daftar customer, member portal, create order, admin order list/detail
- Fitur demo/statik: dashboard, customers detail, payments, membership, order history, services pricing, notifications
- Fitur tidak diimplementasi: contact management, interaction

## File SQL Penting

- `supabase_laundry_member_portal.sql`
- `supabase_laundry_member_portal_seed.sql`
- `orders_migration.sql`
- `migration_refactor_schema.sql`

---

Dokumentasi ini dirapikan berdasarkan file dan implementasi aktif dalam proyek.
