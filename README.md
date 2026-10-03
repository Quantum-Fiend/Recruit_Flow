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

## Run the complete application with Docker

Docker Compose is the primary way to run RecruitFlow. The app is a single Next.js service (UI and API), backed by PostgreSQL. Compose waits for PostgreSQL to become healthy, applies versioned Prisma migrations, safely migrates any legacy resume files, and only then starts the app. The database and uploaded resumes use persistent named volumes.

Redis, a separate API container, and background workers are not part of this application's current architecture: there is no Redis/queue integration or worker process to run. Adding unused services would not improve the app.

### Configure once

Copy the environment template and edit `.env`:

```powershell
Copy-Item .env.example .env
notepad .env
```

Set unique, random values for `POSTGRES_PASSWORD` and `NEXTAUTH_SECRET` (at least 32 characters). Do not commit `.env` or use example/placeholder values for a real deployment. Keep `APP_BIND_ADDRESS=127.0.0.1` for local-only access; for a deployment, expose the app only behind a trusted TLS reverse proxy and configure the bind address and canonical `NEXTAUTH_URL` accordingly. Set optional email and AI credentials only if those integrations are enabled.

### Start everything

From the repository directory, run this single command:

```powershell
docker compose up --build --wait
```

Compose builds the app and starts all required services; no extra terminal, manual database setup, migration command, or separate frontend/API command is needed. When the command reports the services ready, open [http://localhost:3000](http://localhost:3000) and create a recruiter or applicant account. There are no demo accounts or automatic demo seeds; the seed script contains public development credentials and is intentionally not run by the production Docker startup.

The app connects to PostgreSQL using the Docker-internal `db` hostname. Its database URL is generated from the same `POSTGRES_*` values used by the database, including passwords with URL-special characters. PostgreSQL is not published on a host port; only the web app is exposed.

Useful optional operations:

```powershell
docker compose ps
docker compose logs -f web
docker compose down
```

Stopping the stack or rebuilding images preserves database and resume data. **Destructive reset only:** `docker compose down -v` removes the named volumes and permanently deletes the local database and uploaded files.

## Local development without Docker

Docker is the recommended workflow. For development outside containers, use Node.js 20.9 or later, Corepack/Yarn 1.22.22, and a PostgreSQL database. Configure `DATABASE_URL` to point to that database and set `NEXTAUTH_URL` and a unique `NEXTAUTH_SECRET` in `.env`; then run:

```powershell
corepack yarn install --frozen-lockfile
corepack yarn prisma generate
corepack yarn db:migrate:dev
corepack yarn dev
```

Optional demo seed data can be loaded into a non-production database with `corepack yarn prisma db seed`. The seed script refuses to run when `NODE_ENV=production`; seeded accounts use the development-only password `password123` and must never be used in a deployed environment.

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `POSTGRES_USER` | No | Docker Compose database user (defaults to `recruitflow`). |
| `POSTGRES_PASSWORD` | Yes for Docker | Unique database password; the app's internal PostgreSQL URL is built from this and the other `POSTGRES_*` values. |
| `POSTGRES_DB` | No | Docker Compose database name (defaults to `recruitflow`). |
| `APP_PORT` | No | Host port for the web app (defaults to `3000`). |
| `APP_BIND_ADDRESS` | No | Host interface for the web port (defaults to `127.0.0.1`). |
| `NEXTAUTH_URL` | Yes | Canonical application URL (defaults in `.env.example` to `http://localhost:3000`). |
| `NEXTAUTH_SECRET` | Yes | Unique random secret of at least 32 characters used to sign authentication tokens. |
| `AUTH_TRUST_HOST` | No | Set to `true` in the local Compose setup; configure appropriately behind a trusted proxy. |
| `OPENAI_API_KEY` | No | Enables recruiter-triggered resume analysis and copilot. Requests send resume/job context to OpenAI; configure according to your privacy and retention obligations. |
| `OPENAI_RESUME_MODEL` | No | Optional model override for resume analysis. |
| `RESEND_API_KEY` | No | Enables transactional email. |
| `EMAIL_FROM` | No | Verified sender address; email is skipped when this or the API key is absent. |

The former UploadThing integration has been removed: resumes are uploaded to private local storage instead. The application requires persistent writable storage at `data/uploads` (provided by a named volume in Compose). Do not deploy multiple app replicas with node-local disks unless you provide shared durable storage and verify its access controls and lifecycle.

## Resume storage and migration

Resume uploads are limited to 5 MB and validated for supported extension, MIME type, and file signature. Files are stored outside `public/`. The authenticated `/api/resumes/[filename]` route only serves files referenced by an application to its applicant, the recruiter who owns the associated job, or an admin. Upload delivery is private and non-cacheable.

The Compose migration service safely copies files from the existing `recruitflow-uploads` volume to the private volume, updates matching database URLs, verifies that references resolve, then removes legacy public files. It runs automatically after database readiness and before the app starts. Back up both the database and upload volume before upgrading. For non-Compose deployments, preserve the old `public/uploads` files and run `corepack yarn db:secure-uploads` with the production database and old/new storage mounted at the expected paths before routing traffic to the updated application.

Uploads that are not attached to an application can remain as orphaned files; there is not yet a scheduled orphan cleanup or resume-retention policy.

## Database changes and migrations

The supported database is PostgreSQL. `prisma/schema.prisma` is the data model and `prisma/migrations` contains the migration history. For development, create and apply migrations with:

```powershell
corepack yarn db:migrate:dev
```

For Docker Compose, reviewed committed migrations run automatically before the app starts. For other deployments, apply migrations before serving traffic:

```powershell
corepack yarn db:migrate:deploy
```

Never use `prisma db push` as a substitute for production migrations. Back up production data, review generated SQL, and test upgrades and rollback/recovery procedures against a database copy.

## Checks

```powershell
corepack yarn validate
corepack yarn build
corepack yarn prisma validate
```

`validate` runs type-checking, ESLint, and unit tests. Local Compose verification covers clean migration startup, service health, account creation/sign-in, recruiter job creation, candidate resume upload and authorized retrieval, application submission, status changes, recruiter notes, and database/upload persistence across a stop and image rebuild. The OpenAI/Resend integrations need valid external credentials and are not exercised without them. These checks do not replace load testing, high-availability testing, managed-backup/restore drills, or deployment validation. Validate Compose interpolation with `docker compose config --quiet`.

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

Compose is a single-host deployment and does not provide high availability, horizontal scaling, distributed rate limits, managed backups, or a restore process. Back up the database and resume volumes together, rehearse recovery, and validate performance and operational controls in the target environment before enabling real candidate data.
