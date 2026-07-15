-- Dış API cache tablosu (API-Sports vb.) — kural 4/14

-- CreateTable
CREATE TABLE "ExternalCache" (
    "cacheKey" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalCache_pkey" PRIMARY KEY ("cacheKey")
);
