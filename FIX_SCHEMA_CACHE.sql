-- Run this in Supabase SQL Editor to fix the schema cache error
-- "Could not find the 'customer_email' column of 'orders'"

-- Ensure columns exist (safe to run even if they already exist)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
