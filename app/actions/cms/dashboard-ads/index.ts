"use server";

import db from "@/lib/db";
import { DashboardAdsFormSchema } from "@/lib/validators";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import * as z from "zod";

const utapi = new UTApi();

export async function manageDashboardAds(data: z.infer<typeof DashboardAdsFormSchema>) {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const result = DashboardAdsFormSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid data" };
    }

    const incomingAds = result.data.dashboardAds;

    try {
        const existingAds = await db.dashboardAd.findMany({
            include: { mediaAsset: true },
        });
        const existingAdIds = new Set(existingAds.map((ad) => ad.id));

        const incomingIds = new Set();
        const mediaAssetsToDelete: string[] = [];

        for (const ad of incomingAds) {
            const mediaConnect = ad.mediaAssetId ? { connect: { id: ad.mediaAssetId } } : undefined;

            if (ad.adId && existingAdIds.has(ad.adId)) {
                // Update existing ad
                const existingAd = existingAds.find((e) => e.id === ad.adId);

                // If updating media, mark old media for deletion
                if (ad.mediaAssetId && existingAd?.mediaAsset && existingAd.mediaAsset.id !== ad.mediaAssetId) {
                    mediaAssetsToDelete.push(existingAd.mediaAsset.key);
                }

                await db.dashboardAd.update({
                    where: { id: ad.adId },
                    data: {
                        title: ad.adTitle,
                        status: ad.status,
                        ...(mediaConnect && { mediaAsset: mediaConnect }),
                    },
                });
                incomingIds.add(ad.adId);
            } else {
                // Create new ad
                if (!mediaConnect) {
                    // Skip if no media asset is provided for a new ad (it's required)
                    continue;
                }

                await db.dashboardAd.create({
                    data: {
                        title: ad.adTitle,
                        status: ad.status,
                        mediaAsset: mediaConnect,
                    },
                });
            }
        }

        // Identify ads to delete
        const adsToDelete = existingAds.filter((ad) => !incomingIds.has(ad.id));

        for (const ad of adsToDelete) {
            if (ad.mediaAsset) {
                mediaAssetsToDelete.push(ad.mediaAsset.key);
            }
            await db.dashboardAd.delete({ where: { id: ad.id } });
        }

        // Cleanup unused media assets from UploadThing
        if (mediaAssetsToDelete.length > 0) {
            try {
                await utapi.deleteFiles(mediaAssetsToDelete);
                // Also clean up from DB if cascading delete didn't handle it
                const keysToDelete = mediaAssetsToDelete;
                await db.mediaAsset.deleteMany({
                    where: { key: { in: keysToDelete } },
                });
            } catch (error) {
                console.error("Failed to delete old ad files:", error);
            }
        }

        revalidatePath("/dashboard/cms");
        revalidatePath("/dashboard");

        return { success: "Dashboard ads managed successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
}
