# 🚀 Deploy to Vercel (Free) - Remote Access

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `fitness-pwa` (or whatever you want)
3. Make it **Public** or **Private** (your choice)
4. Click **"Create repository"**

## Step 2: Push Code to GitHub

Copy and run these commands in your terminal:

```bash
cd fitness-pwa

# Rename branch to main (required by GitHub)
git branch -M main

# Add your GitHub repository (REPLACE WITH YOUR USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/fitness-pwa.git

# Push to GitHub
git push -u origin main
```

**Example (replace with your username):**
```bash
git remote add origin https://github.com/yourname/fitness-pwa.git
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/signup (free account)
2. Click **"Add New..." → "Project"**
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub
5. Find your `fitness-pwa` repository
6. Click **"Import"**

## Step 4: Add Environment Variable

1. In Vercel deployment settings, find **"Environment Variables"**
2. Click **"Add New"**
3. Add:
   - **Key:** `ZHIPU_API_KEY`
   - **Value:** Your GLM 4.7 API key
   - **Environments:** Production, Preview, Development (select all)
4. Click **"Save"**

## Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 1-2 minutes...
3. Click the deployed URL!

Your app will be at: **`https://fitness-pwa-XXXX.vercel.app`**

## Step 6: Access from Anywhere!

✅ **On any device:**
- Open the Vercel URL
- Complete onboarding
- Use your AI coach!

✅ **Install on phone:**
1. Open Vercel URL on phone
2. Tap **"Share"** → **"Add to Home Screen"** (iOS)
3. Tap **"Install"** or **"Add to Home"** (Android)
4. App installed! Works offline too!

## 🎯 Quick Commands Summary

```bash
# 1. Rename to main
cd fitness-pwa
git branch -M main

# 2. Add remote (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/fitness-pwa.git

# 3. Push to GitHub
git push -u origin main

# 4. Go to vercel.com, import repository, add ZHIPU_API_KEY, deploy!
```

## 🔑 Getting Your GLM 4.7 API Key

1. Go to https://open.bigmodel.cn
2. Sign up (free)
3. Get API key from dashboard
4. Add to Vercel as environment variable

## ✅ Done!

Your app is now:
- ✅ Accessible from anywhere in the world
- ✅ Installable on your phone as a PWA
- ✅ Working with AI coach
- ✅ Completely free hosting

**Share the URL with anyone you want!** 🌍
