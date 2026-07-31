-- CreateEnum
CREATE TYPE "BookPersonRole" AS ENUM ('AUTHOR', 'TRANSLATOR', 'EDITOR');

-- AlterTable
ALTER TABLE "BookEntry" ADD COLUMN     "binKitapSlug" TEXT,
ADD COLUMN     "publisherId" TEXT,
ADD COLUMN     "seriesId" TEXT;

-- CreateTable
CREATE TABLE "BookPerson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "binKitapId" TEXT,
    "photo" TEXT,
    "biography" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookPersonOnEntry" (
    "personId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "role" "BookPersonRole" NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BookPersonOnEntry_pkey" PRIMARY KEY ("entryId","personId","role")
);

-- CreateTable
CREATE TABLE "BookPublisher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookPublisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookSeries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookGenre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "key" TEXT,
    "binKitapId" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookGenre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookGenreOnEntry" (
    "genreId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "BookGenreOnEntry_pkey" PRIMARY KEY ("entryId","genreId")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookPerson_slug_key" ON "BookPerson"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BookPerson_binKitapId_key" ON "BookPerson"("binKitapId");

-- CreateIndex
CREATE INDEX "BookPersonOnEntry_personId_idx" ON "BookPersonOnEntry"("personId");

-- CreateIndex
CREATE INDEX "BookPersonOnEntry_entryId_role_orderIndex_idx" ON "BookPersonOnEntry"("entryId", "role", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "BookPublisher_slug_key" ON "BookPublisher"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BookSeries_slug_key" ON "BookSeries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BookGenre_slug_key" ON "BookGenre"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BookGenre_key_key" ON "BookGenre"("key");

-- CreateIndex
CREATE UNIQUE INDEX "BookGenre_binKitapId_key" ON "BookGenre"("binKitapId");

-- CreateIndex
CREATE INDEX "BookGenre_isApproved_idx" ON "BookGenre"("isApproved");

-- CreateIndex
CREATE INDEX "BookGenreOnEntry_genreId_idx" ON "BookGenreOnEntry"("genreId");

-- CreateIndex
CREATE INDEX "BookEntry_publisherId_idx" ON "BookEntry"("publisherId");

-- CreateIndex
CREATE INDEX "BookEntry_seriesId_seriesIndex_idx" ON "BookEntry"("seriesId", "seriesIndex");

-- AddForeignKey
ALTER TABLE "BookEntry" ADD CONSTRAINT "BookEntry_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "BookPublisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookEntry" ADD CONSTRAINT "BookEntry_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "BookSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPersonOnEntry" ADD CONSTRAINT "BookPersonOnEntry_personId_fkey" FOREIGN KEY ("personId") REFERENCES "BookPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPersonOnEntry" ADD CONSTRAINT "BookPersonOnEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "BookEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenreOnEntry" ADD CONSTRAINT "BookGenreOnEntry_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "BookGenre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenreOnEntry" ADD CONSTRAINT "BookGenreOnEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "BookEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

