-- CreateTable
CREATE TABLE "MovieSuggestionDismissal" (
    "id" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MovieSuggestionDismissal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieSuggestionDismissal_userId_tmdbId_key" ON "MovieSuggestionDismissal"("userId", "tmdbId");

-- AddForeignKey
ALTER TABLE "MovieSuggestionDismissal" ADD CONSTRAINT "MovieSuggestionDismissal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
