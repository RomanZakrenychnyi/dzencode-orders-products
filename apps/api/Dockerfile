FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci --workspace=@orders-products/api --include-workspace-root=false
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/src ./apps/api/src
RUN npm run build:api
RUN npm prune --omit=dev --workspace=@orders-products/api --include-workspace-root=false

FROM node:24-bookworm-slim AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=node:node /app/apps/api/dist ./apps/api/dist
COPY --chown=node:node database/migrations ./database/migrations
USER node
EXPOSE 4000
CMD ["sh", "-c", "node apps/api/dist/setup-auth.js && exec node apps/api/dist/server.js"]
