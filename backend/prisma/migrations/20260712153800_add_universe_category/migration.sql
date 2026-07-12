-- CreateTable
CREATE TABLE "UniverseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UniverseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UniverseCategory_slug_key" ON "UniverseCategory"("slug");

-- AlterTable
ALTER TABLE "WikiUniverse" ADD COLUMN "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "WikiUniverse" ADD CONSTRAINT "WikiUniverse_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "UniverseCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "WikiUniverse_categoryId_idx" ON "WikiUniverse"("categoryId");
