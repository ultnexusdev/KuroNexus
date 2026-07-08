# syntax=docker/dockerfile:1

# ---- Build asamasi ----
FROM node:24-slim AS build
WORKDIR /app

# Native modul (bcrypt) kaynaktan derlenmek zorunda kalirsa gerekli araclar
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ openssl \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10

# Once yalnizca bagimlilik dosyalari (Docker katman cache'i icin)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# prisma generate DB baglantisi kurmaz ama prisma.config.ts URL bekler
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN pnpm exec prisma generate && pnpm run build

# ---- Calisma asamasi ----
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production

# Prisma schema engine (migrate deploy) icin openssl
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# node_modules komple kopyalanir: prisma CLI + dotenv, migrate deploy icin gerekli
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/package.json ./package.json

EXPOSE 3001

# Container ayaga kalkarken bekleyen migration'lar uygulanir, sonra API baslar
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
