# RecruitFlow

RecruitFlow is a full-stack applicant tracking system for applicants and recruiting teams. It is built with Next.js, TypeScript, PostgreSQL, and Prisma. The project is actively evolving; this document describes the functionality that is implemented and calls out deployment checks that still need to be completed in the target environment.

## Implemented functionality

- Applicant and recruiter accounts with password-based authentication and role-specific views.
- Job publishing and management, public open-job listings, applications, resume uploads, and applicant status tracking.
- Recruiter review of applications, internal notes, guarded status transitions, and paginated candidate/application lists.
- Status-change history, soft deletion for supported records, and database-backed dashboard summaries.
- Recruiter-triggered AI resume analysis and job-scoped recruiter copilot when an OpenAI API key is configured.
- Candidate comparison and CSV export for the current application list.
- Persistent light/dark theme preference and responsive layouts.
- PostgreSQL schema and versioned Prisma migrations.

This is not yet a multi-tenant enterprise ATS. It does not currently implement custom workspaces, configurable roles/permissions, a general audit log, interview/calendar management, offers/onboarding, workflow automation, real-time notifications, scheduled reports, or billing. Application history currently records status changes only. Email delivery is optional and is not an outbox-backed workflow.

## Technology

- Next.js App Router, React, and TypeScript
- PostgreSQL and Prisma
- Auth.js credentials authentication with bcrypt password hashing
- Tailwind CSS, Radix UI, and reusable React components
- Optional OpenAI resume analysis/copilot and Resend transactional email
- Private local filesystem storage for uploaded resumes
- Yarn Classic managed through Corepack

## Requirements

- Node.js 20.9 or later
- Corepack and Yarn 1.22.22
- PostgreSQL 14 or later for a non-Docker development environment
- Docker Engine with Compose v2 to use the containerized setup

Use Yarn for dependency management and project commands. Do not use npm.

## Local development

1. Install dependencies:

   ```powershell
   corepack yarn install --frozen-lockfile
   ```

2. Create a `.env` file using `.env.example` as a starting point. For a local PostgreSQL instance, set `DATABASE_URL` to a PostgreSQL connection string pointing to that database, and set `NEXTAUTH_URL` to `http://localhost:3000`. Generate a development-only secret with `openssl rand -base64 32` (or another secure random generator) for `NEXTAUTH_SECRET`. Never use the example secret or credentials in production.

3. Generate the Prisma client and apply migrations:

   ```powershell
   corepack yarn prisma generate
   corepack yarn db:migrate:dev
   ```

4. Start the development server:

   ```powershell
   corepack yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

Optional demo seed data can be loaded into a non-production database with `corepack yarn prisma db seed`. The seed script refuses to run when `NODE_ENV=production`; seeded accounts use the development-only password `password123` and must never be used in a deployed environment.

## Docker Compose

Copy `.env.example` to `.env` (PowerShell: `Copy-Item .env.example .env`) and replace the local-only secrets before exposing the service. Compose starts PostgreSQL, applies committed migrations, migrates legacy resume files when present, and then starts the standalone Next.js server:

```powershell
docker compose up --build -d
docker compose ps
docker compose logs -f web
```

Open [http://localhost:3000](http://localhost:3000). `docker compose down` preserves the named database and private-upload volumes. Do not use `docker compose down -v` unless intentionally discarding all persistent data.

Compose uses a local PostgreSQL URL from `.env`. For hosted PostgreSQL, configure `DATABASE_URL` with the provider's required SSL and connection-pooling options; verify the provider-specific Prisma connection string and migration strategy before deployment. Production secrets must be unique and managed outside source control.

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection used by Prisma. Use SSL and a provider-appropriate pooler in production. |
| `NEXTAUTH_URL` | Yes for deployment | Canonical application URL. |
| `NEXTAUTH_SECRET` | Yes | Secret used to sign authentication tokens; generate a unique high-entropy value. |
| `AUTH_TRUST_HOST` | Deployment-dependent | Set to `true` only when the application is behind a trusted proxy or in the provided local Compose setup. |
| `OPENAI_API_KEY` | No | Enables recruiter-triggered resume analysis and copilot. Requests send resume/job context to OpenAI; configure according to your privacy and retention obligations. |
| `OPENAI_RESUME_MODEL` | No | Optional model override for resume analysis. |
| `RESEND_API_KEY` | No | Enables transactional email. |
| `EMAIL_FROM` | No | Verified sender address; email is skipped when this or the API key is absent. |
| `APP_PORT` | No | Host port exposed by Compose (defaults to `3000`). |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | Compose only | Local PostgreSQL container configuration. |

The former UploadThing integration has been removed: resumes are uploaded to private local storage instead. The application requires persistent writable storage at `data/uploads` (provided by a named volume in Compose). Do not deploy multiple app replicas with node-local disks unless you provide shared durable storage and verify its access controls and lifecycle.

## Resume storage and migration

Resume uploads are limited to 5 MB and validated for supported extension, MIME type, and file signature. Files are stored outside `public/`. The authenticated `/api/resumes/[filename]` route only serves files referenced by an application to its applicant, the recruiter who owns the associated job, or an admin. Upload delivery is private and non-cacheable.

The Compose migration service safely copies files from the existing `recruitflow-uploads` volume to the private volume, updates matching database URLs, verifies that references resolve, then removes legacy public files. Back up both the database and upload volume before upgrading. For non-Compose deployments, preserve the old `public/uploads` files and run `corepack yarn db:secure-uploads` with the production database and old/new storage mounted at the expected paths before routing traffic to the updated application. Test this process against a production-like copy first; it has not been verified against a live deployment in this repository.

Uploads that are not attached to an application can remain as orphaned files; there is not yet a scheduled orphan cleanup or resume-retention policy.

## Database changes and migrations

The supported database is PostgreSQL. `prisma/schema.prisma` is the data model and `prisma/migrations` contains the migration history. For development, create and apply migrations with:

```powershell
corepack yarn db:migrate:dev
```

For a deployment, apply reviewed, committed migrations before serving traffic:

```powershell
corepack yarn db:migrate:deploy
```

Never use `prisma db push` as a substitute for production migrations. Back up production data, review generated SQL, and test upgrades and rollback/recovery procedures against a database copy. Migrations and CRUD operations have not been exercised against a live PostgreSQL instance as part of the current repository audit.

## Checks

```powershell
corepack yarn validate
corepack yarn build
corepack yarn prisma validate
```

`validate` runs type-checking, ESLint, and unit tests. These checks do not replace integration testing with PostgreSQL, authenticated end-to-end workflow tests, migration testing, load testing, or deployment validation. Docker Compose configuration can be checked with `docker compose --env-file .env.example config --quiet`; starting containers requires a working Docker Engine.

## Security and production operations

- Recruiter job/application actions check the authenticated role and ownership; applicant resume access is scoped to the signed-in user.
- Application status changes validate the expected prior status and persist the transition history together in a database transaction.
- Passwords are bcrypt-hashed; authentication uses generic credential failures and rate limiting.
- API resume delivery is authenticated and private. Keep the storage volume private, encrypted where required, access-controlled, and included in backups.
- `ADMIN`, `RECRUITER`, and `APPLICANT` are the implemented roles. There is no configurable permission matrix or tenant/workspace isolation.
- Sessions use signed JWTs; account deletion or role changes are not rechecked against the database on every request, so already-issued sessions are not immediately revoked.
- Rate limits currently use process-local memory. They do not coordinate across multiple application instances and reset on restart; use a shared store before horizontally scaling or relying on them as a production abuse-control boundary.
- Configure external error monitoring, structured log retention, database backups/PITR, restore drills, TLS, secret rotation, retention/deletion policies, and incident response in the hosting environment. This repository does not provide those managed operational services.
- AI screening is decision support only. Recruiters must review source material and make hiring decisions; do not use generated scores or summaries as the sole basis for employment decisions.

## Known verification limits

The repository audit could run static checks and application builds, but the environment did not provide a working Docker Engine or configured production PostgreSQL credentials. Consequently, live migrations, database CRUD and concurrency, multi-user tenant isolation, realistic-volume performance, persisted authenticated end-to-end workflows, and backup/restore behavior remain unverified. Do not treat a passing build as proof of production readiness.
