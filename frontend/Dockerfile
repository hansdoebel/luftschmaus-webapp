FROM oven/bun:alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/
RUN bun install --frozen-lockfile
COPY frontend/ frontend/
RUN cd frontend && bun run build

FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/nginx.conf
USER 101
EXPOSE 8080
