# RecruitFlow - Production Deployment Guide

This guide covers deploying RecruitFlow to production environments.

## Prerequisites

- [ ] PostgreSQL database (Neon, Supabase, or managed PostgreSQL)
- [ ] Node.js 18+ hosting (Vercel, Railway, Render, etc.)
- [ ] Resend account for email delivery
- [ ] UploadThing account for file uploads
- [ ] Domain name (optional but recommended)

## Step 1: Database Setup

### Option A: Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (starts with `postgresql://`)
4. Save as `DATABASE_URL` environment variable

### Option B: Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Connection pooling mode)
5. Save as `DATABASE_URL` environment variable

### Option C: Self-Hosted PostgreSQL

```bash
# Install PostgreSQL
# Create database
createdb recruitflow

# Connection string format:
# postgresql://username:password@host:port/database
```

## Step 2: Environment Variables

Set these environment variables in your hosting platform:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/recruitflow"

# NextAuth (CRITICAL - Generate new secret for production!)
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# UploadThing
UPLOADTHING_SECRET="<from-uploadthing-dashboard>"
UPLOADTHING_APP_ID="<from-uploadthing-dashboard>"

# Resend
RESEND_API_KEY="<from-resend-dashboard>"
EMAIL_FROM="noreply@your-domain.com"
```

### Generate Production Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

## Step 3: Third-Party Service Setup

### Resend (Email Service)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use resend.dev for testing
3. Create API key
4. Add to `RESEND_API_KEY` environment variable
5. Set `EMAIL_FROM` to your verified email address

### UploadThing (File Uploads)

1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Create a new app
3. Copy App ID and Secret
4. Add to environment variables

## Step 4: Database Migration

Run database migrations to create schema:

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

## Step 5: Build Application

```bash
# Build for production
npm run build

# Test production build locally
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Push code to GitHub
   - Import project in Vercel dashboard
   - Connect repository

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Settings → Environment Variables

3. **Deploy**
   - Vercel auto-deploys on push to main branch
   - First deployment may take 2-3 minutes

4. **Run Migrations**
   ```bash
   # After first deployment, run migrations
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

### Option 2: Railway

1. **Create New Project**
   - Connect GitHub repository
   - Railway auto-detects Next.js

2. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically sets `DATABASE_URL`

3. **Configure Environment Variables**
   - Add remaining variables in Railway dashboard

4. **Deploy**
   - Railway auto-deploys on push

### Option 3: Render

1. **Create Web Service**
   - Connect GitHub repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

2. **Add PostgreSQL**
   - Create PostgreSQL database in Render
   - Copy internal connection string

3. **Configure Environment Variables**
   - Add all variables in Render dashboard

4. **Deploy**
   - Manual deploy or auto-deploy on push

## Step 6: Post-Deployment Verification

### Health Check

```bash
# Check health endpoint
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-30T12:00:00.000Z",
  "database": "connected"
}
```

### Create Test Accounts

1. **Create Recruiter Account**
   - Navigate to `/signup`
   - Sign up with recruiter role
   - Verify email works (check logs if not configured)

2. **Create Applicant Account**
   - Sign up with applicant role
   - Test job browsing

3. **Test Complete Flow**
   - Recruiter: Create job posting
   - Applicant: Apply to job
   - Recruiter: Update application status
   - Verify email notifications (if configured)

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is unique and secure (32+ characters)
- [ ] `DATABASE_URL` uses SSL connection (`?sslmode=require`)
- [ ] Environment variables are not committed to git
- [ ] Production domain is set in `NEXTAUTH_URL`
- [ ] CORS is properly configured (Next.js handles this)
- [ ] Rate limiting is enabled (built-in)
- [ ] File upload limits are enforced (5MB for resumes)

## Monitoring & Maintenance

### Logging

Production logs are available in your hosting platform:
- **Vercel**: Functions → Logs
- **Railway**: Deployments → Logs
- **Render**: Logs tab

### Database Backups

- **Neon**: Automatic daily backups
- **Supabase**: Automatic backups (paid plans)
- **Railway**: Manual backups via dashboard

### Performance Monitoring

Consider integrating:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Vercel Analytics** - Web vitals

## Scaling Considerations

### Database

- **Connection Pooling**: Use Prisma's connection pooling
- **Indexes**: Already optimized in schema
- **Read Replicas**: For high-traffic applications

### Application

- **Caching**: Next.js automatic caching
- **CDN**: Vercel Edge Network or Cloudflare
- **Serverless**: Auto-scales with traffic

### File Storage

- **UploadThing**: Handles CDN and scaling automatically
- **Alternative**: AWS S3 + CloudFront

## Troubleshooting

### Build Fails

```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Check SSL requirement
# Add to DATABASE_URL: ?sslmode=require
```

### Email Not Sending

- Verify `RESEND_API_KEY` is set
- Check email domain is verified in Resend
- Review application logs for errors
- Test with resend.dev domain first

### File Upload Issues

- Verify `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`
- Check UploadThing dashboard for errors
- Ensure file size is under 5MB

## Rollback Procedure

If deployment fails:

1. **Vercel/Railway**: Revert to previous deployment in dashboard
2. **Database**: Restore from backup if migrations failed
3. **Code**: Revert git commit and redeploy

## Cost Estimates

### Free Tier (Development/Testing)

- **Hosting**: Vercel (Free)
- **Database**: Neon (Free - 0.5GB)
- **Email**: Resend (Free - 100 emails/day)
- **File Storage**: UploadThing (Free - 2GB)

**Total**: $0/month

### Production (Low Traffic)

- **Hosting**: Vercel Pro ($20/month)
- **Database**: Neon Pro ($19/month)
- **Email**: Resend ($20/month - 50k emails)
- **File Storage**: UploadThing Pro ($20/month - 100GB)

**Total**: ~$79/month

### Production (High Traffic)

- **Hosting**: Vercel Enterprise (Custom)
- **Database**: Managed PostgreSQL ($100+/month)
- **Email**: Resend Business ($80+/month)
- **File Storage**: AWS S3 (Variable)

**Total**: $200+/month

## Support

For deployment issues:
- Check hosting platform documentation
- Review application logs
- Open GitHub issue with error details

---

**Ready to deploy? Follow this guide step-by-step for a smooth production launch! 🚀**
