-- CreateTable
CREATE TABLE "TransferNews" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "universeId" TEXT NOT NULL,
    "tmPlayerId" TEXT,

    CONSTRAINT "TransferNews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransferNews_universeId_publishedAt_idx" ON "TransferNews"("universeId", "publishedAt");

-- AddForeignKey
ALTER TABLE "TransferNews" ADD CONSTRAINT "TransferNews_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "WikiUniverse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferNews" ADD CONSTRAINT "TransferNews_tmPlayerId_fkey" FOREIGN KEY ("tmPlayerId") REFERENCES "TmPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
