# ⚡ 5-Minute GitHub & Vercel Setup
## Super Simple - Just Follow Along

**Total Time:** 5 minutes  
**Clicks Required:** ~15 clicks  
**Copy/Paste:** Minimal  

---

## 🟢 DO THIS NOW (Copy-Paste Format)

### STEP 1️⃣: Create GitHub Repository (1 minute)

**Click this link:** https://github.com/new

**Fill in exactly this:**
- Repository name: `tc-collectibles`
- Description: `TC Collectibles - Premium PSA Pokemon Marketplace`
- Visibility: Click **"Public"**
- Everything else: Leave default

**Click:** "Create repository"

✅ Done!

---

### STEP 2️⃣: Get Your Repository URL (30 seconds)

After creating, you'll see a green **"Code"** button.

**Click it** and copy the HTTPS URL:
```
https://github.com/techcraftlabbkk/tc-collectibles.git
```

**Save this somewhere** - you'll need it next.

✅ Done!

---

### STEP 3️⃣: Set Up GitHub Desktop (2 minutes)

**Download & Install:**
- Go to: https://desktop.github.com/
- Click **"Download for macOS"**
- Run installer when done
- Launch **GitHub Desktop**

**Sign In:**
- Click **"Sign in"** (top left)
- Click **"Sign in using your browser"**
- Enter: techcraftlab.bkk@gmail.com
- Enter: [your GitHub password]
- Click **"Authorize desktop"**

✅ Done!

---

### STEP 4️⃣: Add Your Project to GitHub Desktop (1 minute)

**In GitHub Desktop:**
1. Click **"File"** → **"Add Local Repository"**
2. Navigate to your project folder:
   ```
   /Users/stoyreo/Documents/Claude/Projects/TC Collectibles x TechCraft Lab
   ```
3. Click **"Choose"**
4. Dialog appears: Click **"Create a Repository"**
5. Name: `tc-collectibles`
6. Click **"Create Repository"**

✅ Done!

---

### STEP 5️⃣: Publish to GitHub (1 minute)

**In GitHub Desktop:**
1. Look for **"Publish repository"** button (top right) - Click it
2. Verify:
   - Name: `tc-collectibles`
   - Keep private: **Uncheck** (must be PUBLIC)
3. Click **"Publish Repository"**

**GitHub Desktop will:**
- Connect to your GitHub account
- Upload all your code
- Show a checkmark when done

✅ Done!

---

### STEP 6️⃣: Verify Everything Worked (30 seconds)

**Visit:** https://github.com/techcraftlabbkk/tc-collectibles

**You should see:**
- Your project files listed
- All code visible
- Green checkmark next to "main"

✅ Perfect! You're done with GitHub!

---

## 🚀 NOW DEPLOY TO VERCEL (3 minutes)

### STEP 7️⃣: Create Supabase Production Project (5 minutes)

**Go to:** https://app.supabase.com

**Click:** "New Project"

**Fill in:**
- Name: `TC Collectibles Production`
- Password: [Any strong password]
- Region: **ap-southeast-1 (Singapore)** ← Click this
- Click **"Create new project"**

**Wait 5-10 minutes** for it to initialize (don't close window).

Once ready:
- Click **"Settings"** → **"API"**
- Copy these 3 values:
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  ```
- Save them in a text file

✅ Done!

---

### STEP 8️⃣: Get Gmail App Password (2 minutes)

**Go to:** https://myaccount.google.com/apppasswords

**Make sure:**
- 2-Step Verification is ON
- App: Select **"Mail"**
- Device: Select **"Windows Computer"**

**Click:** "Generate"

**Copy the 16-character password** into your text file.

✅ Done!

---

### STEP 9️⃣: Deploy to Vercel (3 minutes)

**Go to:** https://vercel.com/dashboard

**Click:** "Add New" → "Project"

**Paste your repository URL:**
```
https://github.com/techcraftlabbkk/tc-collectibles.git
```

**Click:** "Continue"

**Fill in:**
- Project name: `tc-collectibles`
- Click: "Continue"

**Add Environment Variables:**

Scroll down to "Environment Variables" section.

**Add these 11 variables** (you saved these earlier):

```
NEXT_PUBLIC_SUPABASE_URL = [from Supabase]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [from Supabase]
SUPABASE_SERVICE_ROLE_KEY = [from Supabase]
SMTP_FROM = techcraftlab.bkk@gmail.com
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = techcraftlab.bkk@gmail.com
SMTP_PASSWORD = [from Gmail app password]
PROMPTPAY_PHONE = 09XXXXXXXXX
PROMPTPAY_NAME = TC Collectibles
ADMIN_EMAIL = techcraftlab.bkk@gmail.com
```

**For each variable:**
1. Type name (left)
2. Paste/type value (right)
3. Select **"Production"** scope (dropdown)
4. Click "Add" button
5. Repeat for all 11

**Once all 11 added:**
- Click **"Deploy"**
- Wait for green checkmark (2-5 minutes)

✅ Done!

---

## ✅ VERIFY IT WORKS

**Visit your site:**
```
https://tc-collectibles.vercel.app
```

**Test these:**
- [ ] See products
- [ ] Click "Add to Cart"
- [ ] Checkout page loads
- [ ] PromptPay QR code displays
- [ ] Admin page is accessible

**Send test order:**
- Fill checkout form
- Complete order
- Check email for confirmation (within 1 min)

✅ Success!

---

## 📊 Quick Status

| Step | Task | Time |
|------|------|------|
| 1 | GitHub Repo | 1 min |
| 2 | Get URL | 30 sec |
| 3 | GitHub Desktop | 2 min |
| 4 | Add Project | 1 min |
| 5 | Publish | 1 min |
| 6 | Verify | 30 sec |
| 7 | Supabase | 5 min |
| 8 | Gmail | 2 min |
| 9 | Vercel Deploy | 3 min |
| **TOTAL** | | **~16 min** |

---

## 🚀 You're Live!

Once Vercel shows green checkmark:

**Your site is LIVE at:**
```
https://tc-collectibles.vercel.app
```

**Share this link!**

---

**Status: Ready to Deploy** ✅

Start with **STEP 1** → Follow all steps → **You're live!**

Questions? Check `GITHUB_DESKTOP_SETUP.md` or `DEPLOYMENT_GUIDE.md` for details.
