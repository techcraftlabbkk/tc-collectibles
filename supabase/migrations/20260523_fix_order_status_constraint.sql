-- Fix order status CHECK constraint to match the values used in the admin UI.
-- The original constraint had 'payment_received' but the codebase uses 'paid' and 'processing'.

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'pending_payment',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ));

-- Back-fill any legacy 'payment_received' rows to 'paid'
UPDATE orders SET status = 'paid' WHERE status = 'payment_received';
