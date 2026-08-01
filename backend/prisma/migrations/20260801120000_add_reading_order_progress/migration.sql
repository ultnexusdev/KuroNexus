-- CreateTable
CREATE TABLE "ReadingOrderProgress" (
    "id" TEXT NOT NULL,
    "orderKey" TEXT NOT NULL,
    "currentOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ReadingOrderProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReadingOrderProgress_userId_orderKey_key" ON "ReadingOrderProgress"("userId", "orderKey");

-- AddForeignKey
ALTER TABLE "ReadingOrderProgress" ADD CONSTRAINT "ReadingOrderProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
