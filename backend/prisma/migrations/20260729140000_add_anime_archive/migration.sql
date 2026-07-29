-- CreateEnum
CREATE TYPE "AnimeWatchStatus" AS ENUM ('WATCHING', 'COMPLETED', 'PLANNED', 'ON_HOLD', 'DROPPED', 'REWATCHING');

-- CreateTable
CREATE TABLE "AnimeEntry" (
    "id" TEXT NOT NULL,
    "anilistId" INTEGER NOT NULL,
    "malId" INTEGER,
    "status" "AnimeWatchStatus" NOT NULL DEFAULT 'WATCHING',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "personalRating" DOUBLE PRECISION,
    "personalNote" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AnimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimePart" (
    "id" TEXT NOT NULL,
    "anilistId" INTEGER NOT NULL,
    "malId" INTEGER,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "watchedEpisodes" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "personalRating" DOUBLE PRECISION,
    "episodeMarks" JSONB,
    "mangaChapter" INTEGER,
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "AnimePart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnimeEntry_userId_status_isDeleted_idx" ON "AnimeEntry"("userId", "status", "isDeleted");

-- CreateIndex
CREATE INDEX "AnimeEntry_userId_isFavorite_isDeleted_idx" ON "AnimeEntry"("userId", "isFavorite", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeEntry_userId_anilistId_key" ON "AnimeEntry"("userId", "anilistId");

-- CreateIndex
CREATE INDEX "AnimePart_entryId_orderIndex_idx" ON "AnimePart"("entryId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "AnimePart_entryId_anilistId_key" ON "AnimePart"("entryId", "anilistId");

-- AddForeignKey
ALTER TABLE "AnimeEntry" ADD CONSTRAINT "AnimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimePart" ADD CONSTRAINT "AnimePart_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "AnimeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
