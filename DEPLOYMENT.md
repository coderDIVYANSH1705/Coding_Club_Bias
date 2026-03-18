# Vercel Deployment Guide

## Steps to Deploy on Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Authenticate with Vercel
```bash
vercel login
```

### 3. Deploy to Production
```bash
vercel --prod
```

## Setting Up Environment Variables on Vercel Dashboard

After deploying, you need to configure environment variables in the Vercel dashboard:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `Coding_Club_Bias`
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variables:

### Required Variables:

| Variable | Value | Scope |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key | Production, Preview, Development |
| `ADMIN_ID` | Admin username (e.g., admin@codingclub) | Production, Preview, Development |
| `ADMIN_PASS` | Admin password | Production, Preview, Development |

### Optional Variables:
| Variable | Value | Scope |
|----------|-------|-------|
| `GEMINI_API_KEY` | Your Gemini API key (if using AI features) | Production, Preview, Development |
| `GROQ_API_KEY` | Your Groq API key (if using AI features) | Production, Preview, Development |

## Getting Supabase Credentials

1. Go to [Supabase Console](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Vercel Build Information

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node Version:** 20.x
- **Install Command:** `npm ci`

## Troubleshooting

### Build Fails with "Cannot find module '@/lib/supabase'"
- Ensure all environment variables are set in Vercel dashboard
- Check that variable names are spelled correctly
- Redeploy after adding variables

### Admin Login Not Working
- Verify `ADMIN_ID` and `ADMIN_PASS` are set correctly
- Check that values don't have extra spaces

### Database Queries Failing
- Confirm Supabase URL and anon key are correct
- Verify Supabase project is accessible from Vercel's IP range
- Check database tables exist in Supabase

### Images Not Loading
- Verify image paths in public folder are correct
- For external images (Supabase storage), ensure URLs are public

## After Deployment

1. Test admin login at `https://your-domain.vercel.app/admin/login`
2. Test form submissions (JoinClub form)
3. Verify all database operations work
4. Check Vercel analytics and logs

## Useful Commands

```bash
# Preview deployment before production
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs <deployment-url>

# Rebuild and redeploy
vercel --prod --force
```

## Additional Notes

- Keep `.env.local` file only locally (it's in .gitignore)
- Never commit real credentials to the repository
- Use `.env.example` as a reference for required variables
- Review Vercel documentation: https://vercel.com/docs
