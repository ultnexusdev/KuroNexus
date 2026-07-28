-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('WATCHED', 'WATCHLIST', 'REWATCH');

-- CreateTable
CREATE TABLE "MovieEntry" (
    "id" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "status" "MovieStatus" NOT NULL DEFAULT 'WATCHED',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "personalRating" DOUBLE PRECISION,
    "personalNote" TEXT,
    "watchedAt" TIMESTAMP(3),
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MovieEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MovieEntry_userId_status_isDeleted_idx" ON "MovieEntry"("userId", "status", "isDeleted");

-- CreateIndex
CREATE INDEX "MovieEntry_userId_isFavorite_isDeleted_idx" ON "MovieEntry"("userId", "isFavorite", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "MovieEntry_userId_tmdbId_key" ON "MovieEntry"("userId", "tmdbId");

-- AddForeignKey
ALTER TABLE "MovieEntry" ADD CONSTRAINT "MovieEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
