# RecruitFlow Production Deployment Checklist

Use this checklist to ensure a smooth and secure deployment of RecruitFlow to production.

## 1. Environment Configuration

- [ ] **NEXTAUTH_SECRET**: Generated a cryptographically strong secret.
  - `openssl rand -base64 32`
- [ ] **NEXTAUTH_URL**: Set to the full production domain (e.g., `https://recruitflow.com`).
- [ ] **DATABASE_URL**: Using a production-grade database (e.g., Neon, Supabase) with connection pooling.
- [ ] **RESEND_API_KEY**: Configured for transactional emails.
- [ ] **UPLOADTHING_SECRET** & **UPLOADTHING_APP_ID**: Configured for secure file storage.
- [ ] **NODE_ENV**: Set to `production`.

## 2. Database Setup

- [ ] **Migrations**: Ran `npx prisma migrate deploy` to sync production schema.
- [ ] **Seed Data**: (Optional) Ran seeding for initial roles/categories.
- [ ] **Indexes**: Verified database indexes for performance on high-traffic tables.

## 3. Security Hardening

- [ ] **Rate Limiting**: Verified IP-based and key-based rate limits are active.
- [ ] **CSRF**: Verified origin checks on all sensitive API endpoints.
- [ ] **Middleware**: Verified protected routes require authentication and proper roles.
- [ ] **Audit Trail**: Verified `ApplicationHistory` is being updated correctly.
- [ ] **Encryption**: Verified SSL is forced (Next.js handles this on Vercel/similar).

## 4. Performance Optimization

- [ ] **Build**: Successfull `npm run build`.
- [ ] **Images**: Configured allowed domains for `next/image`.
- [ ] **Caching**: Implemented `revalidatePath` or `revalidateTag` where appropriate.
- [ ] **Bundles**: Verified bundle sizes are optimized.

## 5. Monitoring & Reliability

- [ ] **Logging**: Configured centralized logging (e.g., Axiom, Datadog).
- [ ] **Error Tracking**: Integrated Sentry or similar for real-time error reporting.
- [ ] **Health Checks**: Verified `/api/health` returns 200 OK.
- [ ] **Backups**: Automated database backups are active.

## 6. Functional Verification

- [ ] **Auth Flow**: Tested login/signup/logout in production.
- [ ] **Job Flow**: Tested job creation/editing/closing.
- [ ] **Application Flow**: Tested resume upload and status transitions.
- [ ] **Emails**: Verified emails are being delivered to external addresses.

## 7. Compliance

- [ ] **Soft Delete**: Verified records are not physically deleted during normal operations.
- [ ] **Privacy**: Added Privacy Policy and Terms of Service (if applicable).
- [ ] **Cookies**: Verified cookie consent and secure/httponly flags.

---
**Last Updated**: 2026-01-31
**Status**: Ready for Deployment
