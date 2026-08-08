-- AlterTable
ALTER TABLE "F1Driver" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "portraitAuthor" TEXT,
ADD COLUMN     "portraitLicense" TEXT,
ADD COLUMN     "portraitSourceUrl" TEXT;

-- CreateTable
CREATE TABLE "F1RaceResult" (
    "id" TEXT NOT NULL,
    "seasonYear" INTEGER NOT NULL,
    "round" INTEGER,
    "raceName" TEXT,
    "raceDate" TIMESTAMP(3),
    "position" INTEGER NOT NULL,
    "driverName" TEXT NOT NULL,
    "driverNationality" TEXT,
    "constructorName" TEXT,
    "timeText" TEXT,
    "circuitId" TEXT NOT NULL,
    "driverId" TEXT,
    "externalSource" TEXT NOT NULL DEFAULT 'jolpica',
    "externalFetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "F1RaceResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "F1RaceResult_circuitId_isDeleted_seasonYear_position_idx" ON "F1RaceResult"("circuitId", "isDeleted", "seasonYear", "position");

-- CreateIndex
CREATE INDEX "F1RaceResult_driverId_idx" ON "F1RaceResult"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "F1RaceResult_circuitId_seasonYear_position_key" ON "F1RaceResult"("circuitId", "seasonYear", "position");

-- CreateIndex
CREATE UNIQUE INDEX "F1Driver_externalId_key" ON "F1Driver"("externalId");

-- AddForeignKey
ALTER TABLE "F1RaceResult" ADD CONSTRAINT "F1RaceResult_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "F1Circuit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "F1RaceResult" ADD CONSTRAINT "F1RaceResult_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "F1Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

