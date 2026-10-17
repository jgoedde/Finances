# Multi-stage build:
#  - build the client with node
#  - install the API's production dependencies
#  - run the API, which also serves the built client (same origin)

FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN npm ci --no-audit --no-fund --no-progress
COPY . .
RUN npm run build -w @finances/web


FROM node:24-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN npm ci --omit=dev --workspace=@finances/api --no-audit --no-fund --no-progress


FROM node:24-slim
ENV NODE_ENV=production \
    PORT=3000 \
    DATABASE_PATH=/data/finances.db \
    STATIC_DIR=/app/public
WORKDIR /app

COPY --from=deps /app/node_modules node_modules
COPY packages/shared packages/shared
COPY apps/api/package.json apps/api/
COPY apps/api/src apps/api/src
COPY --from=build /app/apps/web/dist public
COPY docker/finances /usr/local/bin/finances

RUN mkdir /data && chown node:node /data
VOLUME /data
USER node
EXPOSE 3000

# Node runs the TypeScript sources directly (type stripping).
CMD ["node", "apps/api/src/main.ts"]
