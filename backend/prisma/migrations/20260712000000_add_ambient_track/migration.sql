-- CreateTable
CREATE TABLE "AmbientTrack" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "universeId" TEXT NOT NULL,

    CONSTRAINT "AmbientTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AmbientTrack_universeId_idx" ON "AmbientTrack"("universeId");

-- AddForeignKey
ALTER TABLE "AmbientTrack" ADD CONSTRAINT "AmbientTrack_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "WikiUniverse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
