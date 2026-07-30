-- AlterEnum: dizide filmden bir durum fazlası var (haftalarca "izleniyor"
-- halinde kalabilir). Postgres yeni değeri sıraya ekler; BEFORE ile enum
-- içindeki yeri 'WATCHED'ın önüne alınıyor.
ALTER TYPE "ShowStatus" ADD VALUE IF NOT EXISTS 'WATCHING' BEFORE 'WATCHED';

-- CreateTable
CREATE TABLE "ShowSeason" (
    "id" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "watchedEpisodes" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "personalRating" DOUBLE PRECISION,
    "episodeMarks" JSONB,
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "ShowSeason_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShowSeason_entryId_orderIndex_idx" ON "ShowSeason"("entryId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ShowSeason_entryId_seasonNumber_key" ON "ShowSeason"("entryId", "seasonNumber");

-- AddForeignKey
ALTER TABLE "ShowSeason" ADD CONSTRAINT "ShowSeason_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "ShowEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
