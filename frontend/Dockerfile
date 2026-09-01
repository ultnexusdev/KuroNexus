
# ---- Build asamasi ----
FROM node:24-slim AS build
WORKDIR /app

RUN npm install -g pnpm@10

# Once yalnizca bagimlilik dosyalari (Docker katman cache'i icin)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# NEXT_PUBLIC_* degiskenleri build sirasinda bundle'a gomulur —
# Coolify'da bu degisken "Build Variable" olarak isaretlenmeli
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Kapi: degisken verilmeden build alinirsa lib/api/client.ts'teki
# `?? "http://localhost:3001"` yedegi uretim paketine GOMULUR. Build basariyla
# biter, konteyner ayaga kalkar, site acilir - ama hicbir veri gelmez ve
# sebebi hicbir yerde yazmaz. Coolify'da "Build Variable" isareti unutulunca
# olan tam olarak budur (1 Eylul 2026 denetimi, bulgu DCK-04).
# Sessiz-bozuk deploy yerine gurultulu build hatasi: projenin kendi ilkesi
# (bkz. backend/Dockerfile fail-fast migration CMD'si).
RUN test -n "$NEXT_PUBLIC_API_URL" \
    || (echo "HATA: NEXT_PUBLIC_API_URL bos. Coolify'da Build Variable olarak tanimlayin." && exit 1)

# standalone cikti yalnizca Docker build'inde etkin (bkz. next.config.ts)
ENV NEXT_OUTPUT_STANDALONE=1

RUN pnpm run build

# ---- Calisma asamasi ----
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production

# output: "standalone" ciktisi: server.js + minimal node_modules
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
