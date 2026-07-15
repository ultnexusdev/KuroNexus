-- Transfermarkt yerel veri modelleri (Faz B: API-Football yerine)

-- CreateTable
CREATE TABLE "TmCompetition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "countryName" TEXT,
    "domesticLeagueCode" TEXT,
    "confederation" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TmCompetition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TmClub" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clubCode" TEXT,
    "squadSize" INTEGER,
    "averageAge" DOUBLE PRECISION,
    "stadiumName" TEXT,
    "stadiumSeats" INTEGER,
    "url" TEXT,
    "domesticCompetitionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TmClub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TmPlayer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "position" TEXT,
    "subPosition" TEXT,
    "foot" TEXT,
    "heightInCm" INTEGER,
    "marketValueInEur" DOUBLE PRECISION,
    "imageUrl" TEXT,
    "url" TEXT,
    "lastSeason" TEXT,
    "currentClubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TmPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TmGame" (
    "id" TEXT NOT NULL,
    "season" TEXT,
    "round" TEXT,
    "date" TIMESTAMP(3),
    "homeClubGoals" INTEGER,
    "awayClubGoals" INTEGER,
    "stadium" TEXT,
    "attendance" INTEGER,
    "referee" TEXT,
    "url" TEXT,
    "competitionId" TEXT,
    "homeClubId" TEXT,
    "awayClubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TmGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TmTransfer" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "fromClubId" TEXT,
    "toClubId" TEXT,
    "transferDate" TIMESTAMP(3),
    "transferFee" DOUBLE PRECISION,
    "season" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TmTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TmClub_domesticCompetitionId_idx" ON "TmClub"("domesticCompetitionId");

-- CreateIndex
CREATE INDEX "TmPlayer_currentClubId_idx" ON "TmPlayer"("currentClubId");

-- CreateIndex
CREATE INDEX "TmGame_competitionId_idx" ON "TmGame"("competitionId");

-- CreateIndex
CREATE INDEX "TmGame_homeClubId_idx" ON "TmGame"("homeClubId");

-- CreateIndex
CREATE INDEX "TmGame_awayClubId_idx" ON "TmGame"("awayClubId");

-- CreateIndex
CREATE INDEX "TmGame_date_idx" ON "TmGame"("date");

-- CreateIndex
CREATE INDEX "TmTransfer_playerId_idx" ON "TmTransfer"("playerId");

-- CreateIndex
CREATE INDEX "TmTransfer_fromClubId_idx" ON "TmTransfer"("fromClubId");

-- CreateIndex
CREATE INDEX "TmTransfer_toClubId_idx" ON "TmTransfer"("toClubId");

-- AddForeignKey
ALTER TABLE "TmClub" ADD CONSTRAINT "TmClub_domesticCompetitionId_fkey" FOREIGN KEY ("domesticCompetitionId") REFERENCES "TmCompetition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmPlayer" ADD CONSTRAINT "TmPlayer_currentClubId_fkey" FOREIGN KEY ("currentClubId") REFERENCES "TmClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmGame" ADD CONSTRAINT "TmGame_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "TmCompetition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmGame" ADD CONSTRAINT "TmGame_homeClubId_fkey" FOREIGN KEY ("homeClubId") REFERENCES "TmClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmGame" ADD CONSTRAINT "TmGame_awayClubId_fkey" FOREIGN KEY ("awayClubId") REFERENCES "TmClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmTransfer" ADD CONSTRAINT "TmTransfer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "TmPlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmTransfer" ADD CONSTRAINT "TmTransfer_fromClubId_fkey" FOREIGN KEY ("fromClubId") REFERENCES "TmClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TmTransfer" ADD CONSTRAINT "TmTransfer_toClubId_fkey" FOREIGN KEY ("toClubId") REFERENCES "TmClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;
