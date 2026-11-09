FROM node:22-alpine AS build

WORKDIR /workspace
COPY package.json package-lock.json .npmrc ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
RUN npm ci --workspace frontend

COPY frontend ./frontend
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build --workspace frontend

FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime
USER root
RUN apk --no-cache upgrade
USER 101

ENV PORT=8080
ENV BACKEND_SCHEME=http
ENV BACKEND_HOST=backend:5000
ENV NGINX_ENVSUBST_FILTER=^(PORT|BACKEND_SCHEME|BACKEND_HOST|DNS_RESOLVER)$

COPY --chmod=755 frontend/docker-entrypoint.d/05-set-dns-resolver.envsh /docker-entrypoint.d/05-set-dns-resolver.envsh
COPY frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /workspace/frontend/dist /usr/share/nginx/html

EXPOSE 8080
