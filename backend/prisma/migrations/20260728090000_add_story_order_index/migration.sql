-- AlterTable
ALTER TABLE "Story" ADD COLUMN "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Story_universeId_orderIndex_idx" ON "Story"("universeId", "orderIndex");

-- Mevcut bolumler yayin tarihine gore siralanip ilk sirayi alir; boylece
-- atolyedeki el yazmasi agaci ilk acilista bugunku okuma sirasini korur.
WITH ordered AS (
  SELECT "id",
         ROW_NUMBER() OVER (
           PARTITION BY "universeId"
           ORDER BY COALESCE("publishedAt", "createdAt") ASC
         ) AS "position"
  FROM "Story"
  WHERE "isDeleted" = false
)
UPDATE "Story"
SET "orderIndex" = ordered."position"
FROM ordered
WHERE "Story"."id" = ordered."id";
