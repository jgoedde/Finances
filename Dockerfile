# Multi-stage Dockerfile for production builds
#  - build the app with node
#  - serve the generated static files with nginx

FROM node:24-alpine AS builder
WORKDIR /app

# Install only production dependencies for build speed using the lockfile
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --no-progress

# Copy the rest of the sources and build
COPY . .
RUN npm run build


FROM nginx:stable-alpine

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Use our nginx config which falls back to index.html for SPA routing
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

