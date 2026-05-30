-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- PRODUCTS: Everyone can READ, only admins can WRITE
CREATE POLICY "Public read products"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Admin insert products"
  ON products
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin update products"
  ON products
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin delete products"
  ON products
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- ORDERS: Users see their own, admins see all
CREATE POLICY "Users see own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can insert orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin update orders"
  ON orders
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ORDER_ITEMS: Users see their orders' items, admins see all
CREATE POLICY "Users see order items"
  ON order_items
  FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
    OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Users can insert order items"
  ON order_items
  FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- PAYMENTS: Users see their payments, admins see all
CREATE POLICY "Users see own payments"
  ON payments
  FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
    OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Users insert own payments"
  ON payments
  FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin update payments"
  ON payments
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
