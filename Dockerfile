FROM node:20-alpine AS base

WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Development
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production — serve static export with nginx
FROM nginx:alpine AS runner

# Copy security-hardened nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static export output
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
