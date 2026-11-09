FROM node:22-alpine AS build

WORKDIR /workspace
COPY package.json package-lock.json .npmrc ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
RUN npm ci --workspace backend

COPY backend ./backend
RUN npm run build --workspace backend
RUN npm prune --omit=dev --workspace backend

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=5000
WORKDIR /app/backend

COPY --from=build --chown=node:node /workspace/node_modules /app/node_modules
COPY --from=build --chown=node:node /workspace/backend/package.json ./package.json
COPY --from=build --chown=node:node /workspace/backend/dist ./dist
COPY --from=build --chown=node:node /workspace/backend/src/db/schema.sql ./src/db/schema.sql
RUN mkdir -p /var/log/task-management && chown node:node /var/log/task-management
RUN rm -f /usr/local/bin/npm /usr/local/bin/npx \
    && rm -rf /usr/local/lib/node_modules/npm

USER node
EXPOSE 5000
CMD ["node", "dist/server.js"]
