-- AlterTable
ALTER TABLE "Story" ADD COLUMN "universeId" TEXT;

-- CreateIndex
CREATE INDEX "Story_universeId_idx" ON "Story"("universeId");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "WikiUniverse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
