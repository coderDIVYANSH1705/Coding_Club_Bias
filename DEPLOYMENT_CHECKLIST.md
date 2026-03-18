# ✅ Vercel Deployment Checklist

## Pre-Deployment (Local)
- [x] Project builds successfully locally: `npm run build`
- [x] No TypeScript errors
- [x] No runtime errors in dev mode
- [x] All environment variables are in `.env.local`
- [x] Code is committed to GitHub main branch
- [x] All changes pushed to GitHub

## Vercel Setup (One-time)
- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub repository connected to Vercel
- [ ] OR install Vercel CLI: `npm i -g vercel`
- [ ] OR login to Vercel: `vercel login`

## Deployment Commands
```bash
# Method 1: Using Vercel Dashboard (Recommended for beginners)
# Go to https://vercel.com/new and import your GitHub repository

# Method 2: Using Vercel CLI
vercel --prod
```

## Post-Deployment Configuration (Critical!)

### Step 1: Add Environment Variables
Go to: https://vercel.com/dashboard → Select Project → Settings → Environment Variables

Add these variables (set for Production, Preview, and Development):

| Variable | Value |
|----------|-------|
| NEXT_PUBLIC_SUPABASE_URL | Copy from .env.local |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Copy from .env.local |
| ADMIN_ID | admin@codingclub |
| ADMIN_PASS | codingclub123 |

### Step 2: Redeploy After Adding Variables
```bash
vercel --prod
```

Or use dashboard → Redeploy button

## Verification Tests

After deployment, test these features:

- [ ] **Homepage loads:** Visit your Vercel URL
- [ ] **Navigation works:** Test all menu items
- [ ] **Admin login:** Go to `/admin/login`
  - Username: `admin@codingclub`
  - Password: `codingclub123`
- [ ] **Admin dashboard:** Check `/admin` page loads
- [ ] **Events management:** Test add/edit/delete events
- [ ] **Leaders management:** Test add/edit/delete leaders
- [ ] **Members management:** Test view/edit/delete members
- [ ] **Join form:** Submit an application (check in admin panel)
- [ ] **Scroll animations:** Check Hero and TechCentre scroll effects
- [ ] **Images load:** Verify all images display correctly
- [ ] **External images:** Verify Supabase images load

## Troubleshooting

### Build Fails
```bash
# Try local build first
npm run build

# If it passes locally, check Vercel logs
vercel logs --follow
```

### Environment Variables Not Working
- [ ] Variable names spelled exactly correct
- [ ] Values don't have extra spaces
- [ ] Set for all three scopes: Production, Preview, Development
- [ ] After adding, redeploy with `vercel --prod`

### Database Not Connecting
- [ ] Check NEXT_PUBLIC_SUPABASE_URL is correct
- [ ] Check NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- [ ] Verify Supabase tables exist: `members`, `events`, `leaders`
- [ ] Check Supabase project is public/accessible

### Admin Login Not Working
- [ ] ADMIN_ID and ADMIN_PASS match .env.local exactly
- [ ] Check Vercel logs for auth errors
- [ ] Try clearing browser cookies and trying again

### Images Not Loading
- [ ] For public folder images: Verify paths are correct
- [ ] For Supabase images: Ensure bucket is public
- [ ] Check Supabase storage bucket is named `event-images`

## Useful Commands

```bash
# View Vercel logs
vercel logs --follow

# List all your deployments
vercel list

# View specific project settings
vercel env

# Pull down remote environment variables
vercel env pull

# Redeploy a specific deployment
vercel redeploy
```

## Files Created for Deployment
- `vercel.json` - Vercel configuration
- `.env.example` - Environment variables template
- `DEPLOYMENT.md` - Full deployment guide
- `QUICK_DEPLOY.md` - Quick reference guide

## Support Links
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- GitHub: https://github.com/coderDIVYANSH1705/Coding_Club_Bias

---

**Status:** ✅ Ready for deployment!

**Next Steps:**
1. Choose deployment method (Dashboard or CLI)
2. Deploy the project
3. Add environment variables in Vercel
4. Redeploy
5. Run verification tests above
6. Celebrate! 🎉
