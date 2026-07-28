-- AlterTable
ALTER TABLE "WikiEntry" ADD COLUMN "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "StoryEntryLink" (
    "storyId" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryEntryLink_pkey" PRIMARY KEY ("storyId","entryId")
);

-- CreateIndex
CREATE INDEX "StoryEntryLink_entryId_idx" ON "StoryEntryLink"("entryId");

-- AddForeignKey
ALTER TABLE "StoryEntryLink" ADD CONSTRAINT "StoryEntryLink_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryEntryLink" ADD CONSTRAINT "StoryEntryLink_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "WikiEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
