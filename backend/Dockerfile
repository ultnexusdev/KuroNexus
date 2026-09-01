
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

# Derleme bitti; dev bagimliliklari artik olu agirlik. ONCEKI HALINDE bu adim
# YOKTU ve calisma imajina typescript, jest, eslint, @nestjs/cli dahil TUM agac
# gidiyordu (olculdu: node_modules 491 MB, imaj 996 MB - frontend'in iki kati).
# Bedeli disk: bu sunucuda disk dolmasi IKI KEZ uretim arizasi cikardi
# (docs/deploy-duzeni.md 9). 1 Eylul 2026 denetimi, bulgu DCK-01.
#
# Migration adiminin ihtiyaci olan prisma + dotenv bu yuzden dependencies'e
# tasindi; asagidaki iki satir onlarin prune'dan SAG CIKTIGINI build sirasinda
# kanitlar. Kanitlamazsa build burada patlar - yani hata canlida "konteyner
# baslamiyor" olarak degil, deploy logunda gorunur.
RUN pnpm prune --prod \
    && pnpm exec prisma --version \
    && node -e "require('dotenv')"

# ---- Calisma asamasi ----
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production

# openssl: Prisma schema engine (migrate deploy) icin.
# curl: Coolify healthcheck'i icin — 1 Eylul 2026'da olculdu: Coolify,
# Dockerfile tabanli uygulamada HTTP tipli kontrolu bile konteynerin ICINDEN
# curl/wget ile atiyor ("The healthcheck needs a curl or wget command"
# uyarisi + yeni konteynerin rollback'i canli goruldu). Imajda curl yokken
# panel healthcheck'i acmak her deploy'u basarisiz sayar.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl curl \
    && rm -rf /var/lib/apt/lists/*

# Build asamasinda `pnpm prune --prod` ile dev bagimliliklari atilmis agac.
# Icinde migrate deploy icin gereken prisma CLI + dotenv var (ikisi de
# dependencies'te), typescript/jest/eslint yok.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/package.json ./package.json

# Yuklenen gorsellerin klasoru.
#
# Uretimde buraya kalici bir Docker volume mount ediliyor ve MOUNT EDILEN BIR
# VOLUME KENDI SAHIPLIGINI KORUR — imajdaki chown ona islemez. O yuzden
# uretimdeki volume 5 Agustos 2026'da konteyner icinden bir kez
# `chown -R node:node /app/uploads` ile devredildi (olculdu: oncesinde root'tu).
#
# Buradaki satir ILERIDE yeni bir ortam kurulursa gecerli: volume ilk kez
# olusturulurken Docker sahipligi imajdaki klasorden kopyalar.
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# npm/npx ev dizinine yazmak isteyebilir; node kullanicisinin yazabilecegi yeri
# acikca gosteriyoruz. Tanimsiz birakilirsa arac /root'a yazmayi deneyip
# migration adiminda patlayabilir.
ENV HOME=/home/node

# Konteyner artik root DEGIL.
# Gerekce: uygulamada bir acik bulunursa saldirgan konteyner icinde tam
# yetkiyle degil, sinirli bir kullaniciyla baslar. Uygulama calisirken yalnizca
# /app/uploads'a yazmasi gerekiyor, o da yukarida node'a devredildi.
USER node

EXPOSE 3001

# Container ayaga kalkarken bekleyen migration'lar uygulanir, sonra API baslar.
#
# ONCEKI HALI HATALIYDI:
#   npx prisma migrate deploy || echo '...' && node dist/main
# sh'de || ve && ayni oncelikte ve soldan saga okunur, yani ((A || B) && C).
# Migration patlasa echo calisiyor, echo her zaman basarili oluyor ve uygulama
# YINE DE basliyordu — kodun bekledigi tablolar olmadan. Bu projede o durum
# sessiz bir arizaya donusuyor: site 200 doner, raflar bos gelir (bulgu O-8).
#
# Artik migration basarisiz olursa konteyner hic baslamaz. Coolify basarisiz
# deploy'da eski konteyneri devirmedigi icin site ayakta kalir ve gercek hata
# deploy logunda gorunur — sessiz bozulma yerine gurultulu durus.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
