-- DropForeignKey
ALTER TABLE "FootballMoment" DROP CONSTRAINT "FootballMoment_eraId_fkey";

-- AlterTable
ALTER TABLE "FootballMoment" ADD COLUMN     "day" INTEGER,
ADD COLUMN     "labelEn" TEXT,
ADD COLUMN     "labelTr" TEXT,
ADD COLUMN     "month" INTEGER,
ALTER COLUMN "eraId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "F1Moment" ADD COLUMN     "day" INTEGER,
ADD COLUMN     "labelEn" TEXT,
ADD COLUMN     "labelTr" TEXT,
ADD COLUMN     "month" INTEGER;

-- AddForeignKey
ALTER TABLE "FootballMoment" ADD CONSTRAINT "FootballMoment_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "FootballEra"("id") ON DELETE SET NULL ON UPDATE CASCADE;
