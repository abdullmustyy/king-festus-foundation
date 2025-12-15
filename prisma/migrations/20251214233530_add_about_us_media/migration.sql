-- CreateTable
CREATE TABLE "AboutUsMedia" (
    "id" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "aboutUsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutUsMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AboutUsMedia" ADD CONSTRAINT "AboutUsMedia_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutUsMedia" ADD CONSTRAINT "AboutUsMedia_aboutUsId_fkey" FOREIGN KEY ("aboutUsId") REFERENCES "AboutUs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
