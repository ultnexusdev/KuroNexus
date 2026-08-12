-- AlterTable
ALTER TABLE "MusicPlaylist" ADD COLUMN     "genreId" TEXT;

-- AlterTable
ALTER TABLE "MusicalAct" ADD COLUMN     "bannerPosition" TEXT;

-- CreateIndex
CREATE INDEX "MusicPlaylist_genreId_idx" ON "MusicPlaylist"("genreId");

-- AddForeignKey
ALTER TABLE "MusicPlaylist" ADD CONSTRAINT "MusicPlaylist_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "MusicGenre"("id") ON DELETE SET NULL ON UPDATE CASCADE;
