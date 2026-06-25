-- BrightWash laundry services seed data.
-- Uses fixed UUIDs so this seed can be re-run safely.

insert into public.products
  (id, name, description, price, stock, category, unit, estimated_duration, icon, color, is_active)
values
  ('11111111-1111-4111-8111-111111111111', 'Cuci Komplit (Cuci + Setrika)', 'Paket pencucian lengkap termasuk pencucian, pengeringan, dan penyetrikaan pakaian.', 10000, 9999, 'Laundry Reguler', 'Kg', '2 Hari', 'Droplets', 'teal', true),
  ('22222222-2222-4222-8222-222222222222', 'Setrika Saja', 'Layanan penyetrikaan pakaian.', 7000, 9999, 'Laundry Reguler', 'Kg', '1 Hari', 'Shirt', 'cyan', true),
  ('33333333-3333-4333-8333-333333333333', 'Super Express 3 Jam', 'Laundry selesai sekitar 3 jam.', 15000, 9999, 'Express', 'Kg', '3 Jam', 'Zap', 'amber', true),
  ('44444444-4444-4444-8444-444444444444', 'Bedcover & Blanket', 'Pencucian bedcover dan selimut.', 25000, 9999, 'Bedding', 'Kg', '3 Hari', 'Bed', 'indigo', true),
  ('55555555-5555-4555-8555-555555555555', 'Premium Shoes Clean', 'Pembersihan sepatu dengan treatment khusus.', 35000, 9999, 'Shoes Care', 'Pasang', '2 Hari', 'Footprints', 'emerald', true),
  ('66666666-6666-4666-8666-666666666666', 'Premium Satuan (Jas/Gaun)', 'Pencucian jas, blazer, dress, dan gaun.', 15000, 9999, 'Premium', 'Pcs', '2 Hari', 'Sparkles', 'violet', true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  stock = excluded.stock,
  category = excluded.category,
  unit = excluded.unit,
  estimated_duration = excluded.estimated_duration,
  icon = excluded.icon,
  color = excluded.color,
  is_active = excluded.is_active,
  updated_at = now();

