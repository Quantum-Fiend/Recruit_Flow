<p align="center">
  <img src="public/assets/hero-banner.svg" alt="RecruitFlow Banner" width="100%">
</p>

# RecruitFlow - Production-Ready Applicant Tracking System

> [!IMPORTANT]
> **Project Status**: 🚧 **In Progress** 🚧
> This project is currently undergoing active development and production hardening. Core features are being refined for stability and security.

A modern, full-stack Applicant Tracking System (ATS) built with Next.js 14+, featuring role-based access control, workflow automation, and comprehensive audit trails.

---

## ✨ Features

<table border="0">
  <tr>
    <td width="50%" valign="top">
      <img src="public/assets/feature-applicant.svg" align="left" width="60" style="margin-right: 15px;">
      <h3>For Applicants</h3>
      <ul>
        <li>🔍 <b>Job Discovery</b> - Browse and search positions with advanced filtering</li>
        <li>📄 <b>Resume Upload</b> - Secure file upload with validation</li>
        <li>📊 <b>Application Tracking</b> - Real-time status updates</li>
        <li>🔔 <b>Email Notifications</b> - Automated status change updates</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <img src="public/assets/feature-recruiter.svg" align="left" width="60" style="margin-right: 15px;">
      <h3>For Recruiters</h3>
      <ul>
        <li>📝 <b>Job Posting</b> - Manage listings with rich details</li>
        <li>👥 <b>Candidate Review</b> - Comprehensive profiles and history</li>
        <li>🔄 <b>Workflow Engine</b> - Enforced status transition rules</li>
        <li>📋 <b>Internal Notes</b> - Private recruiter-only feedback</li>
        <li>📈 <b>Audit Trail</b> - Compliance-ready change logging</li>
      </ul>
    </td>
  </tr>
</table>

### 🛡️ Production Hardening
- 🔐 **Secure Authentication** - NextAuth.js with bcrypt password hashing
- 🛡️ **Role-Based Access Control** - Separate dashboards for applicants and recruiters
- 🗑️ **Soft Deletes** - Data integrity with recoverable deletions
- 📧 **Email Integration** - Resend API for transactional emails
- 📁 **File Upload** - UploadThing integration with security validation
- 📊 **Monitoring & Logging** - Centralized logging and analytics
- ⚡ **Performance Monitoring** - Track slow operations and optimize

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router, Server Actions, TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **UI Components**: Radix UI + Tailwind CSS
- **File Upload**: UploadThing
- **Email**: Resend
- **Validation**: Zod
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- (Optional) Resend API key for email notifications
- (Optional) UploadThing account for file uploads

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd recruitflow
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/recruitflow"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Uploadthing (Resume uploads)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Resend (Email notifications)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Or run migrations (production)
npx prisma migrate deploy
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
recruitflow/
├── app/
│   ├── (auth)/              # Authentication pages (login, signup)
│   ├── actions/             # Server Actions
│   │   ├── applications.ts  # Application management
│   │   ├── auth.ts          # Authentication actions
│   │   └── jobs.ts          # Job management
│   ├── api/                 # API routes
│   │   ├── applications/    # Application endpoints
│   │   ├── auth/            # NextAuth configuration
│   │   ├── health/          # Health check endpoint
│   │   ├── jobs/            # Job endpoints
│   │   └── uploadthing/     # File upload handlers
│   ├── dashboard/           # Applicant dashboard
│   ├── jobs/                # Job listing and details
│   ├── recruiter/           # Recruiter dashboard
│   ├── globals.css          # Global styles and design system
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── auth-utils.ts        # Authentication utilities
│   ├── email.ts             # Email service
│   ├── file-security.ts     # File upload security
│   ├── monitoring.ts        # Logging and analytics
│   ├── prisma.ts            # Prisma client with soft delete extension
│   ├── rate-limit.ts        # Rate limiting
│   ├── utils.ts             # Utility functions
│   ├── validations.ts       # Zod schemas
│   └── workflow.ts          # Status transition rules
├── prisma/
│   └── schema.prisma        # Database schema
└── middleware.ts            # Route protection
```

## 🔄 Application Workflow

The system enforces a strict workflow for application status transitions:

```
APPLIED
  ├─→ SHORTLISTED
  ├─→ REJECTED
  └─→ WITHDRAWN

SHORTLISTED
  ├─→ INTERVIEW
  ├─→ REJECTED
  └─→ WITHDRAWN

INTERVIEW
  ├─→ OFFER
  ├─→ REJECTED
  ├─→ SHORTLISTED (back)
  └─→ WITHDRAWN

OFFER
  ├─→ HIRED
  ├─→ OFFER_DECLINED
  ├─→ REJECTED
  └─→ WITHDRAWN

HIRED (terminal state)
OFFER_DECLINED (terminal state)
WITHDRAWN (can be reopened to APPLIED)

REJECTED
  └─→ SHORTLISTED (reconsider)
```

All status changes are:
- ✅ Validated against allowed transitions
- 📝 Logged in audit trail with timestamp and user
- 📧 Trigger email notifications to applicants
- 🔒 Restricted to job owner (recruiter)

## 🔐 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **CSRF Protection**: Built-in with Next.js Server Actions
- **Rate Limiting**: Prevent abuse of API endpoints
- **File Upload Security**: 
  - File type validation
  - Size limits (5MB for resumes)
  - Malicious filename detection
  - Virus scanning ready
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Protection**: React's built-in escaping
- **Role-Based Access**: Middleware-enforced route protection

## 📧 Email Notifications

The system sends automated emails for:

1. **Application Received** - Sent to applicant after submission
2. **Status Updates** - Sent when recruiter changes application status

Emails gracefully degrade if `RESEND_API_KEY` is not configured (logs warning instead of failing).

## 🧪 Testing

### Running Tests
```bash
# Run all unit tests
npm run test

# Run full validation suite (lint + type-check + tests)
npm run validate

# Run tests in watch mode
npm run test:watch
```

### Manual Testing Checklist

1. **Authentication**
   - [ ] Sign up as applicant
   - [ ] Sign up as recruiter
   - [ ] Login with valid credentials
   - [ ] Login fails with invalid credentials
   - [ ] Logout works correctly

2. **Applicant Flow**
   - [ ] Browse jobs
   - [ ] Apply to job with resume upload
   - [ ] View application status in dashboard
   - [ ] Cannot apply to same job twice
   - [ ] Cannot apply to closed job

3. **Recruiter Flow**
   - [ ] Create new job posting
   - [ ] View applicants for job
   - [ ] Update application status
   - [ ] Invalid status transitions are rejected
   - [ ] Add notes to application
   - [ ] Close job posting

4. **Security**
   - [ ] Applicants cannot access recruiter routes
   - [ ] Recruiters cannot modify other recruiters' jobs
   - [ ] Soft-deleted records don't appear in queries

## 🚀 Production Deployment

Check the [Production Checklist](./PRODUCTION_CHECKLIST.md) for detailed deployment steps.

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables (Production)

Ensure all environment variables are set in your production environment:
- Use a production PostgreSQL database
- Generate a new `NEXTAUTH_SECRET`
- Configure `NEXTAUTH_URL` to your production domain
- Set up Resend for email delivery
- Configure UploadThing for file storage

### Database Migrations

```bash
# Run migrations in production
npx prisma migrate deploy
```

### Recommended Hosting

- **Application**: Vercel, Railway, or any Node.js hosting
- **Database**: Neon, Supabase, or managed PostgreSQL
- **File Storage**: UploadThing (built-in CDN)
- **Email**: Resend (transactional email service)

## 📊 Monitoring

The application includes built-in monitoring:

- **Logging**: Centralized logger with different levels (info, warn, error, debug)
- **Performance Monitoring**: Track slow operations (>1s)
- **Analytics**: Track key events (applications, status updates, job postings)
- **Security Events**: Log unauthorized access attempts

In production, integrate with services like:
- Sentry (error tracking)
- LogRocket (session replay)
- PostHog/Mixpanel (analytics)

## 🎨 Design System

The application features a modern dark theme with:
- **Colors**: Purple primary (#8b5cf6) with dark backgrounds
- **Typography**: Inter font family with variable font features
- **Components**: Glassmorphism effects, smooth animations, hover states
- **Accessibility**: Focus-visible outlines, semantic HTML, ARIA labels

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Submit a pull request

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments

---

**Built with ❤️ By Tushar using Next.js and modern web technologies**
