FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN corepack yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN corepack yarn prisma generate

# Disable Next.js telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application
RUN corepack yarn build

# Production migration job with the Prisma CLI and migration files.
FROM base AS migrator
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 migrator
COPY --from=deps --chown=migrator:nodejs /app/node_modules ./node_modules
COPY --chown=migrator:nodejs package.json ./
COPY --chown=migrator:nodejs prisma ./prisma
COPY --chown=migrator:nodejs scripts ./scripts
RUN corepack yarn prisma generate \
    && mkdir -p data/uploads public/uploads \
    && chown -R migrator:nodejs data/uploads public/uploads
USER migrator
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && ./node_modules/.bin/tsx scripts/migrate-resumes-to-private.ts"]

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Disable telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
RUN mkdir -p data/uploads && chown nextjs:nodejs data/uploads

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
