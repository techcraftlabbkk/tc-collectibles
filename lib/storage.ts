import { supabase } from './supabase'

// Upload payment proof image
export async function uploadPaymentProof(
  orderId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileName = `${orderId}-${Date.now()}.${file.name.split('.').pop()}`
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .upload(`proofs/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(`proofs/${fileName}`)

    return { url: urlData.publicUrl, error: null }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return { url: null, error: errorMessage }
  }
}

// Upload product image
export async function uploadProductImage(
  productId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileName = `${productId}-${Date.now()}.${file.name.split('.').pop()}`
    const { data, error } = await supabase.storage
      .from('products')
      .upload(`images/${fileName}`, file, {
        cacheControl: '7200',
        upsert: false,
      })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(`images/${fileName}`)

    return { url: urlData.publicUrl, error: null }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return { url: null, error: errorMessage }
  }
}
