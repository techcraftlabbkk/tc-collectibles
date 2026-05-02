// User from Supabase Auth
export type UserProfile = {
  id: string
  email: string
  full_name?: string
  phone?: string
  address?: string
  province?: string
  postal_code?: string
  created_at: string
  updated_at: string
}

// PSA Product
export type Product = {
  id: string
  title: string
  grade?: string // PSA 10, 9, 8, etc.
  description?: string
  price: number
  image_url?: string
  quantity: number
  available: boolean
  created_at: string
  updated_at: string
}

// Customer Order
export type Order = {
  id: string
  user_id: string
  total: number
  status: 'pending_payment' | 'payment_received' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: string
  phone: string
  shipping_note?: string
  created_at: string
  updated_at: string
}

// Order Line Item
export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
  product?: Product // denormalized for convenience
  created_at: string
}

// Payment Proof
export type Payment = {
  id: string
  order_id: string
  method: 'promptpay'
  proof_image_url?: string
  status: 'pending' | 'verified' | 'rejected'
  verified_at?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

// Cart item (client-side)
export type CartItem = {
  product_id: string
  title: string
  grade?: string
  price: number
  quantity: number
  image_url?: string
}

// Checkout form
export type CheckoutForm = {
  shipping_address: string
  province: string
  postal_code: string
  phone: string
  final_sale_agreed: boolean
}
