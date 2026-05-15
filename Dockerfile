FROM node:20-alpine AS base

# Bağımlılıklar
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Çalıştırma
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Data ve generated klasörleri (kalıcı dosyalar için)
RUN mkdir -p /app/data /app/public/generated && chown -R nextjs:nodejs /app/data /app/public/generated

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]