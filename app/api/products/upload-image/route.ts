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

    // Update product with image URL — use .select() to confirm the row was found
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ image_url: imageUrl })
      .eq('id', productId)
      .select('id, image_url')
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'DB update failed: ' + updateError.message },
        { status: 500 }
      );
    }

    if (!updatedProduct) {
      return NextResponse.json(
        { error: `No product found with id ${productId}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    );
  }
}
