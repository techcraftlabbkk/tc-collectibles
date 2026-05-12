# Admin Setup Guide - TC Collectibles

**Timeline**: 30 minutes  
**Goal**: Set up admin users with role-based access control before production launch

---

## 🚀 Quick Start: 4 Steps to Admin Setup

### Step 1: Create Admins Table in Supabase (5 minutes)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your TC Collectibles project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Create Admins Table for Role-Based Access Control
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'moderator', 'viewer')),
  permissions TEXT[] DEFAULT ARRAY['view_orders', 'update_orders', 'view_products', 'update_products'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own admin record" ON admins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage admins" ON admins
  FOR ALL USING (auth.role() = 'service_role');
```

6. Click **Run** (or Ctrl+Enter)
7. Confirm successful execution

---

### Step 2: Get Your Admin User ID (5 minutes)

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Look for your admin user (the one with email: techcraftlab.bkk@gmail.com)
3. Click on that user to open details
4. **Copy the User ID** (UUID format, e.g., `550e8400-e29b-41d4-a716-446655440000`)

---

### Step 3: Add Admin User to Admins Table (5 minutes)

1. In Supabase, go to **SQL Editor** → **New Query**
2. Run this query (replace `YOUR_USER_ID` with the ID from Step 2):

```sql
INSERT INTO admins (user_id, role, permissions) 
VALUES (
  'YOUR_USER_ID',
  'admin',
  ARRAY['view_orders', 'update_orders', 'view_products', 'update_products']
);
```

3. Click **Run**
4. Verify it says "Rows affected: 1"

**Example (with actual UUID):**
```sql
INSERT INTO admins (user_id, role, permissions) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin',
  ARRAY['view_orders', 'update_orders', 'view_products', 'update_products']
);
```

---

### Step 4: Test Admin Access (15 minutes)

1. Go to http://localhost:3000 (or your production URL)
2. Sign in with your admin account (techcraftlab.bkk@gmail.com)
3. Navigate to `/admin` or `/th/admin`
4. Verify you see the admin dashboard with:
   - Dashboard tab (metrics)
   - Orders tab (order list)
   - Products tab (inventory)
5. Try updating an order status to verify functionality

---

## ✅ Admin Roles & Permissions

### Available Roles

| Role | Description | Permissions |
|------|-------------|------------|
| **admin** | Full access | All permissions |
| **moderator** | Limited access | view_orders, update_orders, view_products |
| **viewer** | Read-only | view_orders, view_products |

### Available Permissions

```
view_orders         - Can see all orders
update_orders       - Can change order status
view_products       - Can see inventory
update_products     - Can edit products
```

### Custom Permission Examples

```sql
-- Create a moderator with limited permissions
INSERT INTO admins (user_id, role, permissions) 
VALUES (
  'USER_ID',
  'moderator',
  ARRAY['view_orders', 'view_products']
);

-- Create a viewer with read-only access
INSERT INTO admins (user_id, role, permissions) 
VALUES (
  'USER_ID',
  'viewer',
  ARRAY['view_orders', 'view_products']
);
```

---

## 🔧 Managing Admins

### Add More Admin Users

```sql
-- Add another admin
INSERT INTO admins (user_id, role, permissions) 
VALUES (
  'ANOTHER_USER_ID',
  'admin',
  ARRAY['view_orders', 'update_orders', 'view_products', 'update_products']
);
```

### Remove an Admin

```sql
-- Remove admin access from a user
DELETE FROM admins WHERE user_id = 'USER_ID';
```

### Update Admin Permissions

```sql
-- Give additional permissions
UPDATE admins 
SET permissions = ARRAY['view_orders', 'update_orders', 'view_products', 'update_products', 'manage_admins']
WHERE user_id = 'USER_ID';
```

### View All Admins

```sql
-- List all current admins
SELECT user_id, role, permissions, created_at 
FROM admins 
ORDER BY created_at DESC;
```

---

## 🔐 Security Notes

✅ **Good Practices:**
- Limit admin accounts to trusted team members only
- Use strong passwords for admin accounts
- Enable 2FA on admin accounts (via Supabase Auth settings)
- Regularly audit admin access
- Remove admin access when team members leave
- Different roles (admin, moderator, viewer) for different access levels

⚠️ **Before Production:**
- [ ] Create at least one admin user
- [ ] Test admin login and dashboard access
- [ ] Verify non-admin users cannot access `/admin`
- [ ] Verify non-admin users are redirected to home page
- [ ] Test all admin permissions work correctly

---

## 🧪 Testing Checklist

```
ADMIN SETUP VERIFICATION

Test as Admin User:
□ Sign in with admin account
□ Access /admin or /th/admin
□ See dashboard with metrics
□ See orders list
□ See products inventory
□ Can update order status
□ Can view order details

Test as Non-Admin User:
□ Sign in with regular user account
□ Try to access /admin
□ Get "Access denied" message
□ Auto-redirect to home page
□ Can still browse products and checkout
```

---

## 🆘 Troubleshooting

### "Access denied. You are not an admin."

**Problem:** User logged in but not in admins table  
**Solution:** Run the INSERT query from Step 3 with correct user ID

### Cannot find my user ID in Supabase

**Problem:** User hasn't signed up yet  
**Solution:** Create user account first by signing up on the website

### Admin table doesn't exist

**Problem:** SQL migration wasn't run  
**Solution:** Run the SQL from Step 1 in Supabase SQL Editor

### "User is not an admin" message but I added them

**Problem:** Changes not visible immediately  
**Solution:** Clear browser cache and log out/log in again

### Can't update order status in admin

**Problem:** User has 'viewer' role (read-only)  
**Solution:** Add 'update_orders' permission to their admin record

---

## 📞 Production Checklist

Before deploying to production:

- [ ] SQL migration executed in Supabase
- [ ] Admin user(s) added to admins table
- [ ] Admin dashboard tested and working
- [ ] Non-admin access properly blocked
- [ ] All admin features verified (orders, products, status updates)
- [ ] Error messages working in both EN and TH
- [ ] Redirect to home page working
- [ ] Admin email configured correctly

---

**Status**: Ready for Production  
**Estimated Time to Complete**: 30 minutes  
**Critical for Launch**: Yes ✅

