-- CreateTable
CREATE TABLE "CuratedImage" (
    "id" TEXT NOT NULL,
    "surface" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "url" TEXT,
    "position" TEXT,
    "scale" INTEGER,
    "ratio" TEXT,
    "altTr" TEXT,
    "altEn" TEXT,
    "credit" TEXT,
    "treatment" TEXT,
    "opacity" INTEGER,
    "blend" TEXT,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CuratedImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CuratedImage_surface_isDeleted_idx" ON "CuratedImage"("surface", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "CuratedImage_surface_slotId_key" ON "CuratedImage"("surface", "slotId");
