# 🚀 Quick Vercel Deployment Steps

## Step 1: Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

## Step 2: Login to Vercel
```bash
vercel login
```
Follow the prompts in your browser to authenticate.

## Step 3: Deploy to Vercel
```bash
vercel --prod
```
This will deploy from your current directory to production.

## Step 4: Configure Environment Variables on Vercel Dashboard

After the deployment completes, go to:
1. **Visit:** https://vercel.com/dashboard
2. **Select Project:** Find "Coding_Club_Bias" in your projects
3. **Navigate to:** Settings → Environment Variables
4. **Add these variables:**

```
NEXT_PUBLIC_SUPABASE_URL = (your value from .env.local)
NEXT_PUBLIC_SUPABASE_ANON_KEY = (your value from .env.local)
ADMIN_ID = admin@codingclub
ADMIN_PASS = codingclub123
GEMINI_API_KEY = (optional)
GROQ_API_KEY = (optional)
```

⚠️ **Important:** Make sure each variable is set for **Production, Preview, and Development** scopes.

## Step 5: Redeploy After Adding Variables
```bash
vercel --prod
```

Or trigger a redeploy from Vercel dashboard:
1. Go to your project dashboard
2. Click the three dots menu
3. Select "Redeploy"

## Step 6: Test Your Deployment

- **Visit your site:** `https://your-project-name.vercel.app`
- **Test admin login:** `https://your-project-name.vercel.app/admin/login`
  - Username: `admin@codingclub`
  - Password: `codingclub123`
- **Test form submission:** Try the "Join Us" form
- **Check database:** Verify data appears in Supabase

## Expected Errors & Solutions

### ❌ "Cannot find module '@/lib/supabase'"
**Solution:** Environment variables not set in Vercel. Go to Settings → Environment Variables and add them.

### ❌ "Admin login not working"
**Solution:** Check that ADMIN_ID and ADMIN_PASS are exactly matching your .env.local file (no extra spaces).

### ❌ "Database queries failing"
**Solution:** 
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct
- Check Supabase project is accessible from Vercel (should be by default)
- Verify database tables exist

### ❌ "Build fails"
**Solution:** Run `npm run build` locally first to catch errors before deploying.

## Useful Commands

```bash
# Deploy to staging (preview)
vercel

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs --follow

# List all deployments
vercel list

# Redeploy specific deployment
vercel --prod --force
```

## Your Project Details
- **GitHub Repo:** https://github.com/coderDIVYANSH1705/Coding_Club_Bias
- **Framework:** Next.js 16.1.6
- **Database:** Supabase
- **Hosting:** Vercel

---

**Need help?** Check the full `DEPLOYMENT.md` file in the repository root.
