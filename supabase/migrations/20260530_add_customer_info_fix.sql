-- FIX: Add customer_name and customer_email columns to orders table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qaitwuscmzwmtlodruwc/sql
-- Then reload the schema cache: POST /rest/v1/ with Prefer: return=representation header, or restart the project

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Refresh schema cache (run this after the ALTER TABLE)
NOTIFY pgrst, 'reload schema';
