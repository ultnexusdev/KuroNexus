-- CreateEnum
CREATE TYPE "ShowStatus" AS ENUM ('WATCHED', 'WATCHLIST', 'REWATCH');

-- CreateTable
CREATE TABLE "ShowEntry" (
    "id" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "status" "ShowStatus" NOT NULL DEFAULT 'WATCHED',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "personalRating" DOUBLE PRECISION,
    "personalNote" TEXT,
    "watchedAt" TIMESTAMP(3),
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "links" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ShowEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShowEntry_userId_status_isDeleted_idx" ON "ShowEntry"("userId", "status", "isDeleted");

-- CreateIndex
CREATE INDEX "ShowEntry_userId_isFavorite_isDeleted_idx" ON "ShowEntry"("userId", "isFavorite", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "ShowEntry_userId_tmdbId_key" ON "ShowEntry"("userId", "tmdbId");

-- AddForeignKey
ALTER TABLE "ShowEntry" ADD CONSTRAINT "ShowEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "ShowSuggestionDismissal" (
    "id" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ShowSuggestionDismissal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShowSuggestionDismissal_userId_tmdbId_key" ON "ShowSuggestionDismissal"("userId", "tmdbId");

-- AddForeignKey
ALTER TABLE "ShowSuggestionDismissal" ADD CONSTRAINT "ShowSuggestionDismissal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
