-- Create Admins Table for Role-Based Access Control
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'moderator', 'viewer')),
  permissions TEXT[] DEFAULT ARRAY['view_orders', 'update_orders', 'view_products', 'update_products'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow users to view their own admin record
CREATE POLICY "Users can view own admin record" ON admins
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Allow service role to manage admins
CREATE POLICY "Service role can manage admins" ON admins
  FOR ALL USING (auth.role() = 'service_role');

-- Add comment
COMMENT ON TABLE admins IS 'Admin users with role-based access control';
COMMENT ON COLUMN admins.role IS 'Admin role: admin (full access), moderator (limited), viewer (read-only)';
COMMENT ON COLUMN admins.permissions IS 'Array of permissions granted to this admin user';
