FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS deps
COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile --non-interactive

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn prisma generate && yarn build

FROM base AS migrator
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs migrator
COPY --from=deps --chown=migrator:nodejs /app/node_modules ./node_modules
COPY --chown=migrator:nodejs package.json ./
COPY --chown=migrator:nodejs prisma ./prisma
COPY --chown=migrator:nodejs scripts/migrate-resumes-to-private.ts scripts/docker-entrypoint.mjs ./scripts/
RUN yarn prisma generate \
    && mkdir -p public/uploads data/uploads \
    && chown -R migrator:nodejs public/uploads data/uploads
ENV NODE_ENV=production
USER migrator
ENTRYPOINT ["node", "scripts/docker-entrypoint.mjs"]
CMD ["migrate"]

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs \
    && mkdir -p .next data/uploads \
    && chown -R nextjs:nodejs .next data
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/scripts/docker-entrypoint.mjs ./scripts/docker-entrypoint.mjs
USER nextjs
EXPOSE 3000
ENTRYPOINT ["node", "scripts/docker-entrypoint.mjs"]
CMD ["server"]
