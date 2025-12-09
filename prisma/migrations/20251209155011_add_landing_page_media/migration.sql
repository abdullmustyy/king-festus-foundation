/*
  Warnings:

  - You are about to drop the column `heroMediaAssetId` on the `LandingPage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LandingPage" DROP CONSTRAINT "LandingPage_heroMediaAssetId_fkey";

-- AlterTable
ALTER TABLE "LandingPage" DROP COLUMN "heroMediaAssetId";

-- CreateTable
CREATE TABLE "LandingPageMedia" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "landingPageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPageMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LandingPageMedia" ADD CONSTRAINT "LandingPageMedia_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingPageMedia" ADD CONSTRAINT "LandingPageMedia_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
