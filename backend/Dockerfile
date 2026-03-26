FROM oven/bun:alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN bun install --frozen-lockfile --production
COPY backend/src/ backend/src/

FROM oven/bun:alpine
WORKDIR /app
COPY --from=build /app/backend ./
COPY --from=build /app/node_modules ./node_modules
USER 1000
EXPOSE 3000
CMD ["bun", "src/index.js"]
