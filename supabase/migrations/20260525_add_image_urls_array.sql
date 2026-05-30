-- Add image_urls array column for multi-image support per product.
-- image_url (TEXT) is kept as the primary/first image for backward compatibility
-- with existing product display pages.

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

-- Backfill: copy existing image_url values into the new array column
UPDATE products
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) = 0);
