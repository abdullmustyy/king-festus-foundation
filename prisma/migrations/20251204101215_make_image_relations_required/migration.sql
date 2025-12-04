/*
  Warnings:

  - Made the column `imageId` on table `DashboardAd` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageId` on table `GovernanceBody` required. This step will fail if there are existing NULL values in that column.
  - Made the column `heroImageId` on table `LandingPage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageId` on table `Media` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DashboardAd" DROP CONSTRAINT "DashboardAd_imageId_fkey";

-- DropForeignKey
ALTER TABLE "GovernanceBody" DROP CONSTRAINT "GovernanceBody_imageId_fkey";

-- DropForeignKey
ALTER TABLE "LandingPage" DROP CONSTRAINT "LandingPage_heroImageId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_imageId_fkey";

-- AlterTable
ALTER TABLE "DashboardAd" ALTER COLUMN "imageId" SET NOT NULL;

-- AlterTable
ALTER TABLE "GovernanceBody" ALTER COLUMN "imageId" SET NOT NULL;

-- AlterTable
ALTER TABLE "LandingPage" ALTER COLUMN "heroImageId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "imageId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingPage" ADD CONSTRAINT "LandingPage_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernanceBody" ADD CONSTRAINT "GovernanceBody_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardAd" ADD CONSTRAINT "DashboardAd_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
