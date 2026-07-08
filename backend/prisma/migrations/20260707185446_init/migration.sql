-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "WikiCategory" AS ENUM ('CHARACTER', 'LOCATION', 'TERM', 'EVENT', 'ITEM', 'ORGANIZATION', 'MAGIC_SYSTEM');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('ANIME', 'MOVIE', 'TV_SERIES', 'BOOK', 'MANGA', 'GAME');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isCommunitySubmission" BOOLEAN NOT NULL DEFAULT false,
    "submissionStatus" "SubmissionStatus" NOT NULL DEFAULT 'APPROVED',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiUniverse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WikiUniverse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiEntry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "WikiCategory" NOT NULL,
    "coverImage" TEXT,
    "metadata" JSONB,
    "spoilerTier" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "universeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WikiEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WikiEntryRelation" (
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "relationType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WikiEntryRelation_pkey" PRIMARY KEY ("fromId","toId")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "mediaType" "MediaType" NOT NULL,
    "externalId" TEXT,
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "coverImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterAnalysis" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "coverImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "reviewId" TEXT,
    "wikiEntryId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CharacterAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "character" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagOnStory" (
    "tagId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,

    CONSTRAINT "TagOnStory_pkey" PRIMARY KEY ("tagId","storyId")
);

-- CreateTable
CREATE TABLE "TagOnWikiEntry" (
    "tagId" TEXT NOT NULL,
    "wikiEntryId" TEXT NOT NULL,

    CONSTRAINT "TagOnWikiEntry_pkey" PRIMARY KEY ("tagId","wikiEntryId")
);

-- CreateTable
CREATE TABLE "TagOnReview" (
    "tagId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,

    CONSTRAINT "TagOnReview_pkey" PRIMARY KEY ("tagId","reviewId")
);

-- CreateTable
CREATE TABLE "TagOnCharacterAnalysis" (
    "tagId" TEXT NOT NULL,
    "characterAnalysisId" TEXT NOT NULL,

    CONSTRAINT "TagOnCharacterAnalysis_pkey" PRIMARY KEY ("tagId","characterAnalysisId")
);

-- CreateTable
CREATE TABLE "TagOnQuote" (
    "tagId" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,

    CONSTRAINT "TagOnQuote_pkey" PRIMARY KEY ("tagId","quoteId")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "storyId" TEXT,
    "reviewId" TEXT,
    "wikiEntryId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "storyId" TEXT,
    "reviewId" TEXT,
    "wikiEntryId" TEXT,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- CreateIndex
CREATE INDEX "Story_userId_idx" ON "Story"("userId");

-- CreateIndex
CREATE INDEX "Story_isPublished_isDeleted_idx" ON "Story"("isPublished", "isDeleted");

-- CreateIndex
CREATE INDEX "Story_submissionStatus_idx" ON "Story"("submissionStatus");

-- CreateIndex
CREATE UNIQUE INDEX "WikiUniverse_slug_key" ON "WikiUniverse"("slug");

-- CreateIndex
CREATE INDEX "WikiEntry_userId_idx" ON "WikiEntry"("userId");

-- CreateIndex
CREATE INDEX "WikiEntry_universeId_category_isDeleted_idx" ON "WikiEntry"("universeId", "category", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "WikiEntry_universeId_slug_key" ON "WikiEntry"("universeId", "slug");

-- CreateIndex
CREATE INDEX "WikiEntryRelation_toId_idx" ON "WikiEntryRelation"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_slug_key" ON "Review"("slug");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_mediaType_isPublished_isDeleted_idx" ON "Review"("mediaType", "isPublished", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterAnalysis_slug_key" ON "CharacterAnalysis"("slug");

-- CreateIndex
CREATE INDEX "CharacterAnalysis_userId_idx" ON "CharacterAnalysis"("userId");

-- CreateIndex
CREATE INDEX "CharacterAnalysis_reviewId_idx" ON "CharacterAnalysis"("reviewId");

-- CreateIndex
CREATE INDEX "CharacterAnalysis_wikiEntryId_idx" ON "CharacterAnalysis"("wikiEntryId");

-- CreateIndex
CREATE INDEX "Quote_userId_idx" ON "Quote"("userId");

-- CreateIndex
CREATE INDEX "MediaAsset_userId_idx" ON "MediaAsset"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_isApproved_isDeleted_idx" ON "Comment"("isApproved", "isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_storyId_key" ON "Favorite"("userId", "storyId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_reviewId_key" ON "Favorite"("userId", "reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_wikiEntryId_key" ON "Favorite"("userId", "wikiEntryId");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiEntry" ADD CONSTRAINT "WikiEntry_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "WikiUniverse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiEntry" ADD CONSTRAINT "WikiEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiEntryRelation" ADD CONSTRAINT "WikiEntryRelation_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "WikiEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WikiEntryRelation" ADD CONSTRAINT "WikiEntryRelation_toId_fkey" FOREIGN KEY ("toId") REFERENCES "WikiEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterAnalysis" ADD CONSTRAINT "CharacterAnalysis_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterAnalysis" ADD CONSTRAINT "CharacterAnalysis_wikiEntryId_fkey" FOREIGN KEY ("wikiEntryId") REFERENCES "WikiEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterAnalysis" ADD CONSTRAINT "CharacterAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnStory" ADD CONSTRAINT "TagOnStory_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnStory" ADD CONSTRAINT "TagOnStory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnWikiEntry" ADD CONSTRAINT "TagOnWikiEntry_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnWikiEntry" ADD CONSTRAINT "TagOnWikiEntry_wikiEntryId_fkey" FOREIGN KEY ("wikiEntryId") REFERENCES "WikiEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnReview" ADD CONSTRAINT "TagOnReview_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnReview" ADD CONSTRAINT "TagOnReview_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnCharacterAnalysis" ADD CONSTRAINT "TagOnCharacterAnalysis_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnCharacterAnalysis" ADD CONSTRAINT "TagOnCharacterAnalysis_characterAnalysisId_fkey" FOREIGN KEY ("characterAnalysisId") REFERENCES "CharacterAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnQuote" ADD CONSTRAINT "TagOnQuote_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnQuote" ADD CONSTRAINT "TagOnQuote_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_wikiEntryId_fkey" FOREIGN KEY ("wikiEntryId") REFERENCES "WikiEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_wikiEntryId_fkey" FOREIGN KEY ("wikiEntryId") REFERENCES "WikiEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
