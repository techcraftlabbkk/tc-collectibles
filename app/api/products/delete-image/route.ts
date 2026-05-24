import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabaseServer';

const BUCKET = 'products';

export async function DELETE(request: NextRequest) {
  try {
    const { productId, imageUrl } = await request.json();

    if (!productId || !imageUrl) {
      return NextResponse.json({ error: 'Missing productId or imageUrl' }, { status: 400 });
    }

    // Fetch current image_urls (graceful: column may not exist before migration)
    const { data: current } = await supabase
      .from('products')
      .select('image_urls')
      .eq('id', productId)
      .single();

    const existingUrls: string[] = Array.isArray(current?.image_urls) ? current.image_urls : [];
    const newUrls = existingUrls.filter((u) => u !== imageUrl);

    // Update DB: try array update, fall back to image_url only
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_urls: newUrls, image_url: newUrls[0] ?? null })
      .eq('id', productId);

    if (updateError) {
      // Fallback for pre-migration: just null out image_url
      await supabase.from('products').update({ image_url: null }).eq('id', productId);
    }

    // Delete file from Supabase Storage (extract path after "/object/public/products/")
    try {
      const marker = `/object/public/${BUCKET}/`;
      const idx = imageUrl.indexOf(marker);
      if (idx !== -1) {
        const storagePath = imageUrl.slice(idx + marker.length);
        await supabase.storage.from(BUCKET).remove([storagePath]);
      }
    } catch (storageErr) {
      console.error('Storage delete error (non-fatal):', storageErr);
    }

    return NextResponse.json({ success: true, imageUrls: newUrls });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete image' },
      { status: 500 }
    );
  }
}
