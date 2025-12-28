# 1. Base image for dependencies
FROM node:20-alpine AS deps
WORKDIR /app
# Install dependencies
COPY package.json ./
RUN npm install

# 2. Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
# Copy all source files
COPY . .
# Build the application
RUN npm run build

# 3. Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy production assets from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
