/*
  Warnings:

  - You are about to drop the column `imageId` on the `DashboardAd` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `GovernanceBody` table. All the data in the column will be lost.
  - You are about to drop the column `heroImageId` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mediaAssetId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaAssetId` to the `DashboardAd` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaAssetId` to the `GovernanceBody` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heroMediaAssetId` to the `LandingPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaAssetId` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaAssetType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaAssetType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- Insert data from Image to MediaAsset
INSERT INTO "MediaAsset" ("id", "key", "name", "url", "type", "createdAt", "updatedAt")
SELECT "id", "key", "name", "url", 'IMAGE'::"MediaAssetType", "createdAt", "updatedAt"
FROM "Image";

-- Add temporary nullable columns
ALTER TABLE "DashboardAd" ADD COLUMN "new_mediaAssetId" TEXT;
ALTER TABLE "GovernanceBody" ADD COLUMN "new_mediaAssetId" TEXT;
ALTER TABLE "LandingPage" ADD COLUMN "new_heroMediaAssetId" TEXT;
ALTER TABLE "Media" ADD COLUMN "new_mediaAssetId" TEXT;

-- Update related tables
UPDATE "DashboardAd"
SET "new_mediaAssetId" = "imageId";

UPDATE "GovernanceBody"
SET "new_mediaAssetId" = "imageId";

UPDATE "LandingPage"
SET "new_heroMediaAssetId" = "heroImageId";

UPDATE "Media"
SET "new_mediaAssetId" = "imageId";

-- DropForeignKey
ALTER TABLE "DashboardAd" DROP CONSTRAINT "DashboardAd_imageId_fkey";

-- DropForeignKey
ALTER TABLE "GovernanceBody" DROP CONSTRAINT "GovernanceBody_imageId_fkey";

-- DropForeignKey
ALTER TABLE "LandingPage" DROP CONSTRAINT "LandingPage_heroImageId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_imageId_fkey";

-- DropIndex
DROP INDEX "Media_imageId_key";

-- Drop old columns
ALTER TABLE "DashboardAd" DROP COLUMN "imageId";
ALTER TABLE "GovernanceBody" DROP COLUMN "imageId";
ALTER TABLE "LandingPage" DROP COLUMN "heroImageId";
ALTER TABLE "Media" DROP COLUMN "imageId";

-- Rename new columns
ALTER TABLE "DashboardAd" RENAME COLUMN "new_mediaAssetId" TO "mediaAssetId";
ALTER TABLE "GovernanceBody" RENAME COLUMN "new_mediaAssetId" TO "mediaAssetId";
ALTER TABLE "LandingPage" RENAME COLUMN "new_heroMediaAssetId" TO "heroMediaAssetId";
ALTER TABLE "Media" RENAME COLUMN "new_mediaAssetId" TO "mediaAssetId";

-- Make new columns NOT NULL
ALTER TABLE "DashboardAd" ALTER COLUMN "mediaAssetId" SET NOT NULL;
ALTER TABLE "GovernanceBody" ALTER COLUMN "mediaAssetId" SET NOT NULL;
ALTER TABLE "LandingPage" ALTER COLUMN "heroMediaAssetId" SET NOT NULL;
ALTER TABLE "Media" ALTER COLUMN "mediaAssetId" SET NOT NULL;

-- DropTable
DROP TABLE "Image";

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_key_key" ON "MediaAsset"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Media_mediaAssetId_key" ON "Media"("mediaAssetId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingPage" ADD CONSTRAINT "LandingPage_heroMediaAssetId_fkey" FOREIGN KEY ("heroMediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernanceBody" ADD CONSTRAINT "GovernanceBody_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardAd" ADD CONSTRAINT "DashboardAd_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
