-- Küratörün favori ilk 11'i (Salon 06 · Futbol).
--
-- Kullanıcı isteği: sayfada 4-2-3-1 düzeninde, mevcut Galatasaray kadrosundan
-- kendi seçtiği bir 11 dursun ve küratör modundan düzenlenebilsin.
--
-- Bu tablo GERÇEK maç kadrosu DEĞİL; teknik direktörün dizilişi elimizde yok
-- (o veri ücretli sağlayıcıda). Sayfada da "küratörün 11'i" olarak sunuluyor.
--
-- ExternalCache KULLANILMADI bilinçli olarak: orası dış kaynaktan çekilen ve
-- senkronla EZİLEN veri için. Bu kayıt küratörün yazdığı içerik; senkron onu
-- silmemeli. Diziliş "slots" JSON haritasında tutuluyor (yuva → oyuncu
-- kimliği) ki 3-5-2'ye geçmek migration gerektirmesin.
--
-- ETKİ: 1 CREATE TABLE, 1 UNIQUE INDEX. Mevcut hiçbir tabloya dokunmuyor,
-- 0 DROP, 0 ALTER. Geri alınabilir.

-- CreateTable
CREATE TABLE "FootballLineup" (
    "id" TEXT NOT NULL,
    "clubKey" TEXT NOT NULL,
    "formation" TEXT NOT NULL DEFAULT '4-2-3-1',
    "slots" JSONB NOT NULL,
    "noteTr" TEXT,
    "noteEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FootballLineup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FootballLineup_clubKey_key" ON "FootballLineup"("clubKey");
