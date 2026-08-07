-- Karakter dizininden cikarilan karakterler.
--
-- TAMAMEN EKLEMELI: mevcut hicbir tabloya, kolona ya da veriye dokunulmuyor.
-- Geri alinmasi tek satir:  DROP TABLE "HiddenCharacter";
--
-- Dizin, arsivdeki serilerin AniList kadrolarindan turetiliyor; bir karakteri
-- "silmek" diye bir sey yok, kaynak onu her tazelemede geri getirir. Kalici
-- olan tek sey bu dislama listesi.
--
-- "characterId" UNIQUE: ayni karakter iki kez gizlenemez, ve gizlemeyi geri
-- almak icin characterId'den tek kayda ulasmak yeterli.

CREATE TABLE "HiddenCharacter" (
    "id" TEXT NOT NULL,
    "characterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "HiddenCharacter_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "HiddenCharacter_characterId_key"
    ON "HiddenCharacter"("characterId");

-- Kural 14: listeleme/suzme alanina index sart, Prisma otomatik koymaz
CREATE INDEX "HiddenCharacter_userId_idx" ON "HiddenCharacter"("userId");
