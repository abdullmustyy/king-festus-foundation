/*
  Warnings:

  - You are about to drop the column `image` on the `DashboardAd` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `GovernanceBody` table. All the data in the column will be lost.
  - You are about to drop the column `heroImage` on the `LandingPage` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Media_key_key";

-- AlterTable
ALTER TABLE "DashboardAd" DROP COLUMN "image",
ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "GovernanceBody" DROP COLUMN "image",
ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "LandingPage" DROP COLUMN "heroImage",
ADD COLUMN     "heroImageId" TEXT;

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "key",
DROP COLUMN "name",
DROP COLUMN "url",
ADD COLUMN     "imageId" TEXT;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_key_key" ON "Image"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Media_imageId_key" ON "Media"("imageId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingPage" ADD CONSTRAINT "LandingPage_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernanceBody" ADD CONSTRAINT "GovernanceBody_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardAd" ADD CONSTRAINT "DashboardAd_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
