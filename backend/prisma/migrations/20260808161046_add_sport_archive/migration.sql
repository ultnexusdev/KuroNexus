-- CreateEnum
CREATE TYPE "FootballFigureRole" AS ENUM ('PLAYER', 'COACH', 'FOUNDER', 'PRESIDENT', 'OTHER');

-- CreateEnum
CREATE TYPE "SportImageSlot" AS ENUM ('HERO', 'PORTRAIT', 'GALLERY', 'TRACK');

-- CreateTable
CREATE TABLE "FootballClub" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "officialName" TEXT,
    "shortName" TEXT,
    "nicknameTr" TEXT,
    "nicknameEn" TEXT,
    "foundedYear" INTEGER,
    "countryCode" TEXT,
    "cityName" TEXT,
    "stadiumName" TEXT,
    "stadiumCapacity" INTEGER,
    "crestImage" TEXT,
    "coverImage" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "taglineTr" TEXT,
    "taglineEn" TEXT,
    "narrativeTr" TEXT,
    "narrativeEn" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "universeId" TEXT,
    "tmClubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FootballClub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FootballEra" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "titleTr" TEXT NOT NULL,
    "titleEn" TEXT,
    "subtitleTr" TEXT,
    "subtitleEn" TEXT,
    "narrativeTr" TEXT,
    "narrativeEn" TEXT,
    "contextTr" TEXT,
    "contextEn" TEXT,
    "personalNoteTr" TEXT,
    "personalNoteEn" TEXT,
    "coverImage" TEXT,
    "accentColor" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "clubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FootballEra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FootballMoment" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'MILESTONE',
    "year" INTEGER NOT NULL,
    "happenedAt" TIMESTAMP(3),
    "titleTr" TEXT NOT NULL,
    "titleEn" TEXT,
    "narrativeTr" TEXT,
    "narrativeEn" TEXT,
    "imageUrl" TEXT,
    "captionTr" TEXT,
    "captionEn" TEXT,
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "eraId" TEXT NOT NULL,
    "legendId" TEXT,
    "matchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FootballMoment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FootballEraFigure" (
    "eraId" TEXT NOT NULL,
    "legendId" TEXT NOT NULL,
    "roleTr" TEXT,
    "roleEn" TEXT,
    "noteTr" TEXT,
    "noteEn" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FootballEraFigure_pkey" PRIMARY KEY ("eraId","legendId")
);

-- CreateTable
CREATE TABLE "FootballLegend" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "epithetTr" TEXT,
    "epithetEn" TEXT,
    "role" "FootballFigureRole" NOT NULL DEFAULT 'PLAYER',
    "countryCode" TEXT,
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "yearsFrom" INTEGER,
    "yearsTo" INTEGER,
    "shirtNumber" INTEGER,
    "portraitImage" TEXT,
    "coverImage" TEXT,
    "narrativeTr" TEXT,
    "narrativeEn" TEXT,
    "contextTr" TEXT,
    "contextEn" TEXT,
    "personalNoteTr" TEXT,
    "personalNoteEn" TEXT,
    "achievementsTr" TEXT,
    "achievementsEn" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "personalRank" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "clubId" TEXT,
    "playerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FootballLegend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FootballPlayer" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "position" TEXT,
    "shirtNumber" INTEGER,
    "countryCode" TEXT,
    "birthDate" TIMESTAMP(3),
    "photo" TEXT,
    "appearances" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "noteTr" TEXT,
    "noteEn" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "clubId" TEXT,
    "tmPlayerId" TEXT,
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FootballPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FootballMatch" (
    "id" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3),
    "seasonStartYear" INTEGER,
    "stage" TEXT,
    "homeGoals" INTEGER,
    "awayGoals" INTEGER,
    "homePenalties" INTEGER,
    "awayPenalties" INTEGER,
    "venueName" TEXT,
    "attendance" INTEGER,
    "competitionId" TEXT,
    "homeClubId" TEXT,
    "homeName" TEXT,
    "homeCrest" TEXT,
    "awayClubId" TEXT,
    "awayName" TEXT,
    "awayCrest" TEXT,
    "externalId" TEXT,
    "externalData" JSONB,
    "externalDataFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FootballMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FootballCompetition" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameTr" TEXT NOT NULL,
    "nameEn" TEXT,
    "shortName" TEXT,
    "type" TEXT,
    "countryCode" TEXT,
    "isInternational" BOOLEAN NOT NULL DEFAULT false,
    "logoImage" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FootballCompetition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "F1Circuit" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "officialName" TEXT,
    "nicknameTr" TEXT,
    "nicknameEn" TEXT,
    "countryCode" TEXT,
    "cityName" TEXT,
    "firstGrandPrixYear" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lengthMeters" INTEGER,
    "cornerCount" INTEGER,
    "drsZones" INTEGER,
    "isClockwise" BOOLEAN,
    "lapRecordTime" TEXT,
    "lapRecordYear" INTEGER,
    "lapRecordDriverId" TEXT,
    "trackSvgPath" TEXT,
    "trackSvgViewBox" TEXT,
    "startLineOffset" DOUBLE PRECISION,
    "coverImage" TEXT,
    "accentColor" TEXT,
    "narrativeTr" TEXT,
    "narrativeEn" TEXT,
    "contextTr" TEXT,
    "contextEn" TEXT,
    "personalNoteTr" TEXT,
    "personalNoteEn" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "personalRank" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "F1Circuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "F1CircuitCorner" (
    "id" TEXT NOT NULL,
    "number" INTEGER,
    "name" TEXT,
    "nicknameTr" TEXT,
    "nicknameEn" TEXT,
    "noteTr" TEXT,
    "noteEn" TEXT,
    "markerX" DOUBLE PRECISION,
    "markerY" DOUBLE PRECISION,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "circuitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "F1CircuitCorner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "F1Moment" (
    "id" TEXT NOT NULL,
    "seasonYear" INTEGER NOT NULL,
    "happenedAt" TIMESTAMP(3),
    "titleTr" TEXT NOT NULL,
    "titleEn" TEXT,
    "narrativeTr" TEXT,
    "narrativeEn" TEXT,
    "imageUrl" TEXT,
    "captionTr" TEXT,
    "captionEn" TEXT,
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "circuitId" TEXT,
    "seasonId" TEXT,
    "driverId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "F1Moment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "F1Season" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "titleTr" TEXT,
    "titleEn" TEXT,
    "narrativeTr" TEXT,
    "narrativeEn" TEXT,
    "personalNoteTr" TEXT,
    "personalNoteEn" TEXT,
    "coverImage" TEXT,
    "championDriverId" TEXT,
    "championTeamId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "F1Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "F1Driver" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "nicknameTr" TEXT,
    "nicknameEn" TEXT,
    "countryCode" TEXT,
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "activeFrom" INTEGER,
    "activeTo" INTEGER,
    "permanentNumber" INTEGER,
    "championships" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "poles" INTEGER NOT NULL DEFAULT 0,
    "photo" TEXT,
    "narrativeTr" TEXT,
    "narrativeEn" TEXT,
    "personalNoteTr" TEXT,
    "personalNoteEn" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "personalRank" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "F1Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "F1Team" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "countryCode" TEXT,
    "foundedYear" INTEGER,
    "teamColor" TEXT,
    "logoImage" TEXT,
    "narrativeTr" TEXT,
    "narrativeEn" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "F1Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportQuote" (
    "id" TEXT NOT NULL,
    "textTr" TEXT NOT NULL,
    "textEn" TEXT,
    "attribution" TEXT,
    "contextTr" TEXT,
    "contextEn" TEXT,
    "year" INTEGER,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "clubId" TEXT,
    "eraId" TEXT,
    "legendId" TEXT,
    "circuitId" TEXT,
    "driverId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SportQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportImage" (
    "id" TEXT NOT NULL,
    "slot" "SportImageSlot" NOT NULL DEFAULT 'GALLERY',
    "url" TEXT NOT NULL,
    "altTr" TEXT,
    "altEn" TEXT,
    "captionTr" TEXT,
    "captionEn" TEXT,
    "sourceNote" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "clubId" TEXT,
    "eraId" TEXT,
    "legendId" TEXT,
    "circuitId" TEXT,
    "driverId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SportImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FootballClub_slug_key" ON "FootballClub"("slug");

-- CreateIndex
CREATE INDEX "FootballClub_isPublished_isDeleted_orderIndex_idx" ON "FootballClub"("isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "FootballClub_isFeatured_isPublished_isDeleted_idx" ON "FootballClub"("isFeatured", "isPublished", "isDeleted");

-- CreateIndex
CREATE INDEX "FootballClub_universeId_idx" ON "FootballClub"("universeId");

-- CreateIndex
CREATE INDEX "FootballEra_clubId_isPublished_isDeleted_orderIndex_idx" ON "FootballEra"("clubId", "isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "FootballEra_clubId_startYear_idx" ON "FootballEra"("clubId", "startYear");

-- CreateIndex
CREATE UNIQUE INDEX "FootballEra_clubId_slug_key" ON "FootballEra"("clubId", "slug");

-- CreateIndex
CREATE INDEX "FootballMoment_eraId_isPublished_isDeleted_orderIndex_idx" ON "FootballMoment"("eraId", "isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "FootballMoment_legendId_isPublished_isDeleted_year_idx" ON "FootballMoment"("legendId", "isPublished", "isDeleted", "year");

-- CreateIndex
CREATE INDEX "FootballMoment_isHighlight_isPublished_isDeleted_year_idx" ON "FootballMoment"("isHighlight", "isPublished", "isDeleted", "year");

-- CreateIndex
CREATE INDEX "FootballMoment_eraId_kind_isPublished_isDeleted_idx" ON "FootballMoment"("eraId", "kind", "isPublished", "isDeleted");

-- CreateIndex
CREATE INDEX "FootballMoment_matchId_idx" ON "FootballMoment"("matchId");

-- CreateIndex
CREATE INDEX "FootballEraFigure_eraId_orderIndex_idx" ON "FootballEraFigure"("eraId", "orderIndex");

-- CreateIndex
CREATE INDEX "FootballEraFigure_legendId_idx" ON "FootballEraFigure"("legendId");

-- CreateIndex
CREATE UNIQUE INDEX "FootballLegend_slug_key" ON "FootballLegend"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FootballLegend_playerId_key" ON "FootballLegend"("playerId");

-- CreateIndex
CREATE INDEX "FootballLegend_isPublished_isDeleted_orderIndex_idx" ON "FootballLegend"("isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "FootballLegend_isPublished_isDeleted_personalRank_idx" ON "FootballLegend"("isPublished", "isDeleted", "personalRank");

-- CreateIndex
CREATE INDEX "FootballLegend_clubId_isPublished_isDeleted_orderIndex_idx" ON "FootballLegend"("clubId", "isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "FootballPlayer_slug_key" ON "FootballPlayer"("slug");

-- CreateIndex
CREATE INDEX "FootballPlayer_clubId_isDeleted_orderIndex_idx" ON "FootballPlayer"("clubId", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "FootballPlayer_tmPlayerId_idx" ON "FootballPlayer"("tmPlayerId");

-- CreateIndex
CREATE INDEX "FootballMatch_competitionId_idx" ON "FootballMatch"("competitionId");

-- CreateIndex
CREATE INDEX "FootballMatch_homeClubId_isDeleted_playedAt_idx" ON "FootballMatch"("homeClubId", "isDeleted", "playedAt");

-- CreateIndex
CREATE INDEX "FootballMatch_awayClubId_isDeleted_playedAt_idx" ON "FootballMatch"("awayClubId", "isDeleted", "playedAt");

-- CreateIndex
CREATE INDEX "FootballMatch_externalId_idx" ON "FootballMatch"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "FootballCompetition_slug_key" ON "FootballCompetition"("slug");

-- CreateIndex
CREATE INDEX "FootballCompetition_isDeleted_orderIndex_idx" ON "FootballCompetition"("isDeleted", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "F1Circuit_slug_key" ON "F1Circuit"("slug");

-- CreateIndex
CREATE INDEX "F1Circuit_isPublished_isDeleted_orderIndex_idx" ON "F1Circuit"("isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "F1Circuit_isPublished_isDeleted_personalRank_idx" ON "F1Circuit"("isPublished", "isDeleted", "personalRank");

-- CreateIndex
CREATE INDEX "F1Circuit_lapRecordDriverId_idx" ON "F1Circuit"("lapRecordDriverId");

-- CreateIndex
CREATE INDEX "F1CircuitCorner_circuitId_isPublished_isDeleted_orderIndex_idx" ON "F1CircuitCorner"("circuitId", "isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "F1Moment_circuitId_isPublished_isDeleted_seasonYear_idx" ON "F1Moment"("circuitId", "isPublished", "isDeleted", "seasonYear");

-- CreateIndex
CREATE INDEX "F1Moment_seasonId_isPublished_isDeleted_orderIndex_idx" ON "F1Moment"("seasonId", "isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "F1Moment_driverId_isPublished_isDeleted_seasonYear_idx" ON "F1Moment"("driverId", "isPublished", "isDeleted", "seasonYear");

-- CreateIndex
CREATE INDEX "F1Moment_isHighlight_isPublished_isDeleted_seasonYear_idx" ON "F1Moment"("isHighlight", "isPublished", "isDeleted", "seasonYear");

-- CreateIndex
CREATE UNIQUE INDEX "F1Season_slug_key" ON "F1Season"("slug");

-- CreateIndex
CREATE INDEX "F1Season_isPublished_isDeleted_year_idx" ON "F1Season"("isPublished", "isDeleted", "year");

-- CreateIndex
CREATE INDEX "F1Season_championDriverId_idx" ON "F1Season"("championDriverId");

-- CreateIndex
CREATE INDEX "F1Season_championTeamId_idx" ON "F1Season"("championTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "F1Driver_slug_key" ON "F1Driver"("slug");

-- CreateIndex
CREATE INDEX "F1Driver_isPublished_isDeleted_orderIndex_idx" ON "F1Driver"("isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "F1Driver_isPublished_isDeleted_personalRank_idx" ON "F1Driver"("isPublished", "isDeleted", "personalRank");

-- CreateIndex
CREATE UNIQUE INDEX "F1Team_slug_key" ON "F1Team"("slug");

-- CreateIndex
CREATE INDEX "F1Team_isPublished_isDeleted_orderIndex_idx" ON "F1Team"("isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "SportQuote_clubId_isPublished_isDeleted_orderIndex_idx" ON "SportQuote"("clubId", "isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "SportQuote_eraId_isPublished_isDeleted_orderIndex_idx" ON "SportQuote"("eraId", "isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "SportQuote_legendId_isPublished_isDeleted_orderIndex_idx" ON "SportQuote"("legendId", "isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "SportQuote_circuitId_isPublished_isDeleted_orderIndex_idx" ON "SportQuote"("circuitId", "isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "SportQuote_driverId_isPublished_isDeleted_orderIndex_idx" ON "SportQuote"("driverId", "isPublished", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "SportImage_clubId_slot_isDeleted_orderIndex_idx" ON "SportImage"("clubId", "slot", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "SportImage_eraId_slot_isDeleted_orderIndex_idx" ON "SportImage"("eraId", "slot", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "SportImage_legendId_slot_isDeleted_orderIndex_idx" ON "SportImage"("legendId", "slot", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "SportImage_circuitId_slot_isDeleted_orderIndex_idx" ON "SportImage"("circuitId", "slot", "isDeleted", "orderIndex");

-- CreateIndex
CREATE INDEX "SportImage_driverId_slot_isDeleted_orderIndex_idx" ON "SportImage"("driverId", "slot", "isDeleted", "orderIndex");

-- AddForeignKey
ALTER TABLE "FootballClub" ADD CONSTRAINT "FootballClub_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "WikiUniverse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballEra" ADD CONSTRAINT "FootballEra_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "FootballClub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballMoment" ADD CONSTRAINT "FootballMoment_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "FootballEra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballMoment" ADD CONSTRAINT "FootballMoment_legendId_fkey" FOREIGN KEY ("legendId") REFERENCES "FootballLegend"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballMoment" ADD CONSTRAINT "FootballMoment_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "FootballMatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballEraFigure" ADD CONSTRAINT "FootballEraFigure_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "FootballEra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballEraFigure" ADD CONSTRAINT "FootballEraFigure_legendId_fkey" FOREIGN KEY ("legendId") REFERENCES "FootballLegend"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballLegend" ADD CONSTRAINT "FootballLegend_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "FootballClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballLegend" ADD CONSTRAINT "FootballLegend_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "FootballPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballPlayer" ADD CONSTRAINT "FootballPlayer_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "FootballClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballPlayer" ADD CONSTRAINT "FootballPlayer_tmPlayerId_fkey" FOREIGN KEY ("tmPlayerId") REFERENCES "TmPlayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballMatch" ADD CONSTRAINT "FootballMatch_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "FootballCompetition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballMatch" ADD CONSTRAINT "FootballMatch_homeClubId_fkey" FOREIGN KEY ("homeClubId") REFERENCES "FootballClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FootballMatch" ADD CONSTRAINT "FootballMatch_awayClubId_fkey" FOREIGN KEY ("awayClubId") REFERENCES "FootballClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "F1Circuit" ADD CONSTRAINT "F1Circuit_lapRecordDriverId_fkey" FOREIGN KEY ("lapRecordDriverId") REFERENCES "F1Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "F1CircuitCorner" ADD CONSTRAINT "F1CircuitCorner_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "F1Circuit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "F1Moment" ADD CONSTRAINT "F1Moment_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "F1Circuit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "F1Moment" ADD CONSTRAINT "F1Moment_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "F1Season"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "F1Moment" ADD CONSTRAINT "F1Moment_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "F1Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "F1Season" ADD CONSTRAINT "F1Season_championDriverId_fkey" FOREIGN KEY ("championDriverId") REFERENCES "F1Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "F1Season" ADD CONSTRAINT "F1Season_championTeamId_fkey" FOREIGN KEY ("championTeamId") REFERENCES "F1Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportQuote" ADD CONSTRAINT "SportQuote_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "FootballClub"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportQuote" ADD CONSTRAINT "SportQuote_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "FootballEra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportQuote" ADD CONSTRAINT "SportQuote_legendId_fkey" FOREIGN KEY ("legendId") REFERENCES "FootballLegend"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportQuote" ADD CONSTRAINT "SportQuote_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "F1Circuit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportQuote" ADD CONSTRAINT "SportQuote_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "F1Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportImage" ADD CONSTRAINT "SportImage_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "FootballClub"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportImage" ADD CONSTRAINT "SportImage_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "FootballEra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportImage" ADD CONSTRAINT "SportImage_legendId_fkey" FOREIGN KEY ("legendId") REFERENCES "FootballLegend"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportImage" ADD CONSTRAINT "SportImage_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "F1Circuit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportImage" ADD CONSTRAINT "SportImage_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "F1Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================================
-- ELLE EKLENEN CHECK KISITLARI (Prisma bunları modellemez)
--
-- Prisma şeması CHECK kısıtı tanımlayamıyor, ama `migrate deploy` bunlara
-- dokunmaz ve `migrate diff` onları DÜŞÜRMEZ — bildirilmemiş bir INDEX'in
-- aksine (depo o yarayı bir kez aldı: WikiUniverse_categoryId_idx).
-- Belgelenmiş bakım borcu: biri lokalde `migrate reset` yaparsa bu dosyadan
-- yeniden gelirler.
--
-- 1-3) BOŞ ODA YASAĞININ TEK GERÇEK UYGULAMASI.
-- "Yayınlandı ama anlatısı boş" hâli servis nezaketine değil veritabanına
-- bağlanıyor. narrativeTr bilerek NULLABLE (taslak kaydedilebilsin); yalnızca
-- YAYIN anlatı istiyor.
ALTER TABLE "FootballEra"    ADD CONSTRAINT "FootballEra_published_has_narrative"
  CHECK (NOT "isPublished" OR length(btrim(coalesce("narrativeTr",''))) > 0);
ALTER TABLE "FootballLegend" ADD CONSTRAINT "FootballLegend_published_has_narrative"
  CHECK (NOT "isPublished" OR length(btrim(coalesce("narrativeTr",''))) > 0);
ALTER TABLE "F1Circuit"      ADD CONSTRAINT "F1Circuit_published_has_narrative"
  CHECK (NOT "isPublished" OR length(btrim(coalesce("narrativeTr",''))) > 0);

-- 4-5) ÇOKLU SAHİPLİK BÜTÜNLÜĞÜ.
-- Beş nullable sahipten TAM BİRİ dolu olmalı. Sıfır sahipli satır hiçbir yerde
-- görünmez (sessiz yetim), iki sahipli satır iki sayfada birden çıkar.
ALTER TABLE "SportQuote" ADD CONSTRAINT "SportQuote_single_owner"
  CHECK (num_nonnulls("clubId","eraId","legendId","circuitId","driverId") = 1);
ALTER TABLE "SportImage" ADD CONSTRAINT "SportImage_single_owner"
  CHECK (num_nonnulls("clubId","eraId","legendId","circuitId","driverId") = 1);
