-- ============================================================
-- MIGRATION: Refactor Database Schema
-- users.id / user_id → uid
-- customers.id → customer_id
-- ============================================================

-- STEP 1: Rename users primary key to uid
-- (Assuming current PK is "id" or "user_id")
ALTER TABLE users RENAME COLUMN id TO uid;

-- STEP 2: Add new columns to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- STEP 3: Rename customers primary key to customer_id
ALTER TABLE customers RENAME COLUMN id TO customer_id;

-- STEP 4: Add uid foreign key column to customers (links to users.uid)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS uid TEXT REFERENCES users(uid);

-- STEP 5: Add new columns to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- STEP 6: Rename plan → membership if exists
ALTER TABLE customers RENAME COLUMN plan TO membership;

-- STEP 7: Update membership table FK reference
ALTER TABLE membership RENAME COLUMN customerId TO customer_id;

-- STEP 8: Update orders table FK reference
ALTER TABLE orders RENAME COLUMN customerId TO customer_id;

-- STEP 9: Update any other tables referencing old columns
-- (Add more ALTER statements as needed for your specific schema)

-- STEP 10: Create index for performance
CREATE INDEX IF NOT EXISTS idx_customers_uid ON customers(uid);
CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_membership_customer_id ON membership(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
