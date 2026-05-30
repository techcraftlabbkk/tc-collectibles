import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabaseServer';

const BUCKET = 'products';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;

    if (!file || !productId) {
      return NextResponse.json(
        { error: 'Missing file or productId' },
        { status: 400 }
      );
    }

    // Convert file to Buffer (Node.js compatible)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${productId}-${Date.now()}.${ext}`;
    const filepath = `images/${filename}`;

    // Ensure bucket exists AND is public
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === BUCKET);
    if (!bucketExists) {
      const { error: createErr } = await supabase.storage.createBucket(BUCKET, { public: true });
      if (createErr) {
        console.error('Bucket create error:', createErr);
        return NextResponse.json(
          { error: 'Storage bucket error: ' + createErr.message },
          { status: 500 }
        );
      }
    } else {
      // Bucket already exists — force it to be public so getPublicUrl works
      const { error: updateBucketErr } = await supabase.storage.updateBucket(BUCKET, { public: true });
      if (updateBucketErr) {
        console.error('Bucket update error:', updateBucketErr);
        // Non-fatal: log but continue — upload may still work
      }
    }

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filepath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Upload failed: ' + uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filepath);

    const imageUrl = publicData.publicUrl;

    // Fetch current image_urls array (gracefully handle missing column before migration)
    const { data: current, error: fetchError } = await supabase
      .from('products')
      .select('image_urls')
      .eq('id', productId)
      .single();

    if (!fetchError && !current) {
      return NextResponse.json(
        { error: `No product found with id ${productId}` },
        { status: 404 }
      );
    }

    // Build new image_urls array (falls back to single image if column not yet migrated)
    const existingUrls: string[] = Array.isArray(current?.image_urls) ? current.image_urls : [];
    const newUrls = [...existingUrls, imageUrl];

    // Try updating with image_urls array; fall back to image_url only if column doesn't exist yet
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_urls: newUrls, image_url: newUrls[0] })
      .eq('id', productId);

    if (updateError) {
      // Column may not exist yet — fall back to single image_url update
      const { error: fallbackError } = await supabase
        .from('products')
        .update({ image_url: imageUrl })
        .eq('id', productId);
      if (fallbackError) {
        console.error('Database update error (fallback):', fallbackError);
        return NextResponse.json(
          { error: 'DB update failed: ' + fallbackError.message },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, imageUrl, imageUrls: [imageUrl] });
    }

    return NextResponse.json({ success: true, imageUrl, imageUrls: newUrls });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}
