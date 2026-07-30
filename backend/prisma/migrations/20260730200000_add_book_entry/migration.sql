-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('READ', 'READING', 'TO_READ', 'ABANDONED');

-- CreateEnum
CREATE TYPE "BookTranslation" AS ENUM ('TRANSLATED', 'UNTRANSLATED', 'IN_PROGRESS', 'ORIGINAL');

-- CreateTable
CREATE TABLE "BookEntry" (
    "id" TEXT NOT NULL,
    "googleId" TEXT,
    "olKey" TEXT,
    "isbn13" TEXT,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "authors" TEXT[],
    "translator" TEXT,
    "publisher" TEXT,
    "publishedYear" INTEGER,
    "firstPublishedYear" INTEGER,
    "pageCount" INTEGER,
    "language" TEXT,
    "coverImage" TEXT,
    "description" TEXT,
    "genres" TEXT[],
    "seriesName" TEXT,
    "seriesIndex" INTEGER,
    "status" "BookStatus" NOT NULL DEFAULT 'READ',
    "translationState" "BookTranslation" NOT NULL DEFAULT 'TRANSLATED',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "personalRating" DOUBLE PRECISION,
    "personalNote" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "currentPage" INTEGER NOT NULL DEFAULT 0,
    "links" JSONB,
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "universeId" TEXT,

    CONSTRAINT "BookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookEntry_userId_status_isDeleted_idx" ON "BookEntry"("userId", "status", "isDeleted");

-- CreateIndex
CREATE INDEX "BookEntry_userId_isFavorite_isDeleted_idx" ON "BookEntry"("userId", "isFavorite", "isDeleted");

-- CreateIndex
CREATE INDEX "BookEntry_userId_seriesName_isDeleted_idx" ON "BookEntry"("userId", "seriesName", "isDeleted");

-- CreateIndex
CREATE INDEX "BookEntry_universeId_idx" ON "BookEntry"("universeId");

-- CreateIndex
CREATE UNIQUE INDEX "BookEntry_userId_googleId_key" ON "BookEntry"("userId", "googleId");

-- AddForeignKey
ALTER TABLE "BookEntry" ADD CONSTRAINT "BookEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookEntry" ADD CONSTRAINT "BookEntry_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "WikiUniverse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "BookQuote" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "page" INTEGER,
    "context" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "BookQuote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookQuote_entryId_isDeleted_orderIndex_idx" ON "BookQuote"("entryId", "isDeleted", "orderIndex");

-- AddForeignKey
ALTER TABLE "BookQuote" ADD CONSTRAINT "BookQuote_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "BookEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "ReadingGoal" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "targetBooks" INTEGER NOT NULL,
    "targetPages" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ReadingGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReadingGoal_userId_year_key" ON "ReadingGoal"("userId", "year");

-- AddForeignKey
ALTER TABLE "ReadingGoal" ADD CONSTRAINT "ReadingGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
