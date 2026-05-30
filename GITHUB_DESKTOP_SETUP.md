# GitHub Desktop Setup Guide
## Complete Configuration for TC Collectibles

**User:** techcraftlabbkk  
**Project:** TC Collectibles  
**Repository:** https://github.com/techcraftlabbkk/tc-collectibles

---

## 📥 STEP 1: Install GitHub Desktop (if needed)

### Download & Install

1. Go to **https://desktop.github.com/**
2. Click **"Download for macOS"** (since you're on Mac)
3. Run the installer
4. Launch **GitHub Desktop**

✅ GitHub Desktop installed

---

## 🔐 STEP 2: Authenticate with GitHub

### In GitHub Desktop

1. **Open GitHub Desktop**
2. Click **"Sign in"** (top left)
3. Click **"Sign in using your browser"**
4. This opens GitHub.com login:
   - Email: techcraftlab.bkk@gmail.com
   - Password: [your GitHub password]
   - Click **"Sign in"**
5. GitHub asks for permission - click **"Authorize desktop"**
6. You're back in GitHub Desktop - signed in! ✅

✅ GitHub authenticated

---

## 🏗️ STEP 3: Create Repository on GitHub.com

### On GitHub Website

1. Go to **https://github.com/new**
2. Fill in:
   - **Repository name:** `tc-collectibles`
   - **Description:** "TC Collectibles - Premium PSA Pokemon Marketplace"
   - **Public** (not Private - needed for Vercel)
   - Keep other settings default
3. Click **"Create repository"**
4. You'll see the new repository page - **leave this tab open**

✅ Repository created

---

## 📂 STEP 4: Add Existing Project to GitHub Desktop

### Option A: Using GitHub Desktop UI (Recommended)

1. **In GitHub Desktop**, click **"File"** → **"Add Local Repository"**
2. Browse to: `/Users/stoyreo/Documents/Claude/Projects/TC Collectibles x TechCraft Lab`
3. Click **"Choose"**
4. It asks "Create a repository here?" - click **"Create a Repository"**
5. Fill in:
   - **Name:** tc-collectibles
   - **Local Path:** [Already set]
   - **Initialize with a README:** Uncheck (we have files)
   - **Git ignore:** None (we have one)
   - **License:** None
6. Click **"Create Repository"**

✅ Repository created locally

---

## 🔗 STEP 5: Connect Local to GitHub (Push)

### In GitHub Desktop

1. Look for **"Publish repository"** button (top right) - click it
2. Or go **"Repository"** → **"Push"**
3. You'll see a dialog:
   - **Name:** tc-collectibles (already filled)
   - **Description:** [optional]
   - **Keep this code private:** Uncheck (must be PUBLIC for Vercel)
4. Click **"Publish Repository"**

### What Happens
- GitHub Desktop connects to your GitHub account
- Creates the remote repository
- Pushes your code

✅ Code published to GitHub!

---

## ✅ STEP 6: Verify on GitHub.com

### Check Your Repository

1. Go to **https://github.com/techcraftlabbkk/tc-collectibles**
2. You should see:
   - All your project files
   - Code in the browser
   - Green checkmark next to "main" branch
3. Look for the green **Code** button - copy the HTTPS URL:
   ```
   https://github.com/techcraftlabbkk/tc-collectibles.git
   ```

✅ Code visible on GitHub!

---

## 🎯 Common GitHub Desktop Tasks

### After Initial Setup - Making Changes Later

#### **Task: Make Changes & Push to GitHub**

1. **Make code changes** in your editor
2. **In GitHub Desktop** - you'll see files listed with changes
3. Click on files to see what changed
4. **Enter commit message** (bottom left):
   ```
   Updated: [what you changed]
   ```
5. Click **"Commit to main"**
6. Click **"Push origin"** (top right) to push to GitHub

#### **Task: Pull Latest Changes**

1. In GitHub Desktop, click **"Fetch origin"** (top)
2. If changes exist, click **"Pull origin"**
3. Local folder updates

---

## 🔧 GitHub Desktop Settings

### Configure Git Name & Email

**This is important for commits to show correctly:**

1. **GitHub Desktop** → **Preferences** (Mac: ⌘,)
2. **Accounts** tab - verify your account is listed
3. **Git** tab - set:
   - **Name:** Your Name (or "TechCraft Lab")
   - **Email:** techcraftlab.bkk@gmail.com
4. Click **"Save"**

✅ Git configured

---

## 📋 Initial Commit Checklist

### Before First Commit

Make sure these files are correct:

- [ ] `.gitignore` - Should exclude:
  ```
  node_modules/
  .next/
  .env.local
  .env.production
  ```

- [ ] `.env.example` - Should have template (no secrets!)

- [ ] `package.json` - All dependencies listed

- [ ] All source code in `/app`, `/lib`, `/database`

### First Commit

1. **GitHub Desktop shows all files** ready to commit
2. **Summary:** "Initial TC Collectibles MVP Phase 1 - Ready for Production"
3. Click **"Commit to main"**
4. Click **"Publish Repository"** (first time only)

---

## 🚨 Important: .env Files

### NEVER Push .env Files!

These files contain secrets and must NOT be on GitHub:
- ❌ `.env.local` (local development)
- ❌ `.env.production` (production secrets)

Check your `.gitignore`:
```
.env.local
.env.production
```

✅ These should be ignored (not pushed)

---

## 🔄 GitHub Desktop Workflow

### Daily Workflow (Once Set Up)

```
1. Make code changes in editor
   ↓
2. GitHub Desktop shows changes
   ↓
3. Enter commit message
   ↓
4. Click "Commit to main"
   ↓
5. Click "Push origin" (sends to GitHub)
   ↓
6. Vercel auto-deploys from GitHub!
```

---

## ✨ GitHub Desktop Features

### Useful Buttons & Menus

| Button | Purpose |
|--------|---------|
| **Fetch origin** | Check for updates from GitHub |
| **Pull origin** | Download latest from GitHub |
| **Push origin** | Upload your commits to GitHub |
| **Commit** | Save changes locally |
| **Current Branch** | Switch between branches |
| **Repository** | Open in Finder or editor |

---

## 🐛 Troubleshooting

### Problem: "This repository doesn't have any commits"

**Solution:**
1. Make sure at least one file exists
2. GitHub Desktop → **Commit to main** (commit the initial files)
3. Then click **"Publish Repository"**

### Problem: Can't Publish Repository

**Solution:**
1. Check: Are you signed in to GitHub Desktop?
   - GitHub Desktop → Preferences → Accounts
2. Check: Did you create the repo on GitHub.com first?
   - Go to https://github.com/new and create it
3. Try: GitHub Desktop → **Repository** → **Push**

### Problem: Files Not Showing Changes

**Solution:**
1. Make sure you saved files in your editor
2. Click **Refresh** in GitHub Desktop
3. Files should appear with blue dots

### Problem: "Authentication Failed"

**Solution:**
1. GitHub Desktop → **Preferences** → **Accounts**
2. Click **"Sign out"**
3. Click **"Sign in"** again
4. Complete browser authentication

---

## 📊 Verification Checklist

- [ ] GitHub Desktop installed
- [ ] Signed in with GitHub account (techcraftlabbkk)
- [ ] Repository created on GitHub.com (tc-collectibles)
- [ ] Local repository added to GitHub Desktop
- [ ] Repository published (pushed to GitHub)
- [ ] Files visible on GitHub.com
- [ ] `.gitignore` set up correctly
- [ ] `.env.example` included (no secrets)
- [ ] First commit successful
- [ ] Ready for Vercel deployment

---

## 🎯 Next Steps

### After GitHub Desktop Setup:

1. ✅ Make sure all files are committed
2. ✅ Push to GitHub
3. 📋 Proceed to Vercel deployment
4. 🚀 Go-Live!

---

## 📞 Quick Reference

| Need | Action |
|------|--------|
| See changes | GitHub Desktop shows them automatically |
| Save changes | Enter commit message + click Commit |
| Upload to GitHub | Click Push origin |
| Download from GitHub | Click Fetch → Pull |
| Check GitHub status | Go to https://github.com/techcraftlabbkk/tc-collectibles |
| Revert changes | Right-click file → Discard changes |

---

**Status: Ready to Use GitHub Desktop** ✅

Once setup is complete, proceed to Vercel deployment using your repository URL from GitHub!

Created: May 2, 2026
