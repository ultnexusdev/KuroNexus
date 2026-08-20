-- CreateTable
CREATE TABLE "FavouritePlayerImage" (
    "id" TEXT NOT NULL,
    "playerSlug" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FavouritePlayerImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavouritePlayerImage_playerSlug_isDeleted_idx" ON "FavouritePlayerImage"("playerSlug", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "FavouritePlayerImage_playerSlug_slotId_key" ON "FavouritePlayerImage"("playerSlug", "slotId");
