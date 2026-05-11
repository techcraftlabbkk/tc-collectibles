import { supabase } from '@/lib/supabase'

export interface AdminUser {
  id: string
  user_id: string
  role: 'admin' | 'moderator' | 'viewer'
  permissions: string[]
  created_at: string
}

/**
 * Check if a user is an admin
 * @param userId - The user ID to check
 * @returns AdminUser object if admin, null if not
 */
export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.log('User is not an admin:', error.message)
      return null
    }

    return data as AdminUser
  } catch (err) {
    console.error('Error checking admin status:', err)
    return null
  }
}

/**
 * Check if a user has a specific permission
 * @param userId - The user ID to check
 * @param permission - The permission to verify
 * @returns true if user has permission, false otherwise
 */
export async function hasPermission(userId: string, permission: string): Promise<boolean> {
  const admin = await getAdminUser(userId)
  if (!admin) return false
  return admin.permissions.includes(permission)
}

/**
 * Get all admin users
 * @returns Array of admin users
 */
export async function getAllAdmins(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []) as AdminUser[]
  } catch (err) {
    console.error('Error fetching admins:', err)
    return []
  }
}

/**
 * Add an admin user
 * @param userId - The user ID to make admin
 * @param role - The role to assign (default: 'admin')
 * @param permissions - Permissions to grant
 * @returns AdminUser if successful, null if failed
 */
export async function addAdmin(
  userId: string,
  role: 'admin' | 'moderator' | 'viewer' = 'admin',
  permissions: string[] = ['view_orders', 'update_orders', 'view_products', 'update_products']
): Promise<AdminUser | null> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .insert([{ user_id: userId, role, permissions }])
      .select()
      .single()

    if (error) throw error
    return data as AdminUser
  } catch (err) {
    console.error('Error adding admin:', err)
    return null
  }
}

/**
 * Remove an admin user
 * @param userId - The user ID to remove from admin
 * @returns true if successful, false if failed
 */
export async function removeAdmin(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('user_id', userId)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error removing admin:', err)
    return false
  }
}

/**
 * Update admin permissions
 * @param userId - The user ID to update
 * @param permissions - New permissions array
 * @returns AdminUser if successful, null if failed
 */
export async function updateAdminPermissions(
  userId: string,
  permissions: string[]
): Promise<AdminUser | null> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .update({ permissions })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data as AdminUser
  } catch (err) {
    console.error('Error updating admin permissions:', err)
    return null
  }
}
