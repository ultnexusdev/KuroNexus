-- Karakter sayfasindaki elle yuklenen gorseller.
--
-- TAMAMEN EKLEMELI (additive): mevcut hicbir tabloya, kolona ya da veriye
-- dokunulmuyor. Geri alinmasi iki satir:
--   DROP TABLE "CharacterImage"; DROP TYPE "CharacterImageSlot";
--
-- "characterId" bir foreign key DEGIL, AniList karakter numarasi: karakterler
-- bizim veritabanimizda durmuyor, AniList'ten cache uzerinden geliyor
-- (bkz. anilist.service.ts). Sayfa adresi de bu numara.

CREATE TYPE "CharacterImageSlot" AS ENUM ('PORTRAIT', 'GALLERY', 'ABILITY');

CREATE TABLE "CharacterImage" (
    "id" TEXT NOT NULL,
    "characterId" INTEGER NOT NULL,
    "slot" "CharacterImageSlot" NOT NULL DEFAULT 'GALLERY',
    "abilityName" TEXT,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CharacterImage_pkey" PRIMARY KEY ("id")
);

-- Kural 14: listeleme/suzme alanlarina index sart, Prisma otomatik koymaz
CREATE INDEX "CharacterImage_characterId_slot_isDeleted_idx"
    ON "CharacterImage"("characterId", "slot", "isDeleted");

CREATE INDEX "CharacterImage_userId_idx" ON "CharacterImage"("userId");
