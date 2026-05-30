-- ============================================================================
-- SUPABASE STORAGE POLICIES FOR PRODUCT IMAGES
-- Run this in the Supabase SQL Editor if images are still inaccessible
-- after deploying the code fix.
-- ============================================================================

-- 1. Ensure the products bucket exists and is public
-- (You can also do this in Storage → Buckets → products → Edit → enable "Public bucket")
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Allow anyone to read/view product images (public access)
CREATE POLICY "Public read product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'products');

-- 3. Allow authenticated admin to upload product images
CREATE POLICY "Admin upload product images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

-- 4. Allow authenticated admin to update (replace) product images
CREATE POLICY "Admin update product images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

-- 5. Allow authenticated admin to delete product images
CREATE POLICY "Admin delete product images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );
