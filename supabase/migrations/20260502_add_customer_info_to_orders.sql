-- Add customer email and name to orders table for email notifications
ALTER TABLE orders
ADD COLUMN customer_email VARCHAR(255),
ADD COLUMN customer_name VARCHAR(255);

-- Create index on customer_email for faster lookups
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
