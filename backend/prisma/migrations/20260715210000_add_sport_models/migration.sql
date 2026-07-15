-- Spor kanadı Faz A modelleri: kadro, efsaneler, yarış takvimi, şampiyona sıralaması

-- CreateTable
CREATE TABLE "SportPlayer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shirtNumber" INTEGER,
    "position" TEXT NOT NULL,
    "nationality" TEXT,
    "imageUrl" TEXT,
    "appearances" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "universeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SportPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportLegend" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "era" TEXT,
    "title" TEXT,
    "story" TEXT NOT NULL,
    "imageUrl" TEXT,
    "achievements" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "universeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SportLegend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaceEvent" (
    "id" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "circuit" TEXT NOT NULL,
    "country" TEXT,
    "raceDate" TIMESTAMP(3),
    "trackSvgPath" TEXT,
    "universeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RaceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverStanding" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "driver" TEXT NOT NULL,
    "team" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "teamColor" TEXT,
    "universeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DriverStanding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SportPlayer_universeId_isDeleted_idx" ON "SportPlayer"("universeId", "isDeleted");
CREATE INDEX "SportLegend_universeId_isDeleted_idx" ON "SportLegend"("universeId", "isDeleted");
CREATE INDEX "RaceEvent_universeId_isDeleted_idx" ON "RaceEvent"("universeId", "isDeleted");
CREATE INDEX "DriverStanding_universeId_isDeleted_idx" ON "DriverStanding"("universeId", "isDeleted");

-- AddForeignKey
ALTER TABLE "SportPlayer" ADD CONSTRAINT "SportPlayer_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "WikiUniverse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SportLegend" ADD CONSTRAINT "SportLegend_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "WikiUniverse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RaceEvent" ADD CONSTRAINT "RaceEvent_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "WikiUniverse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DriverStanding" ADD CONSTRAINT "DriverStanding_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "WikiUniverse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
