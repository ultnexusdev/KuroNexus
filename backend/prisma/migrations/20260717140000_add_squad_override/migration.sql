-- CreateTable
CREATE TABLE "SquadOverride" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "tmPlayerId" TEXT,
    "name" TEXT,
    "position" TEXT,
    "age" INTEGER,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SquadOverride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SquadOverride_tmPlayerId_key" ON "SquadOverride"("tmPlayerId");

-- CreateIndex
CREATE INDEX "SquadOverride_teamId_idx" ON "SquadOverride"("teamId");
