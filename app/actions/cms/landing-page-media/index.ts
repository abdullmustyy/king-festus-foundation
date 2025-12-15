"use server";

import db from "@/lib/db";
import { LandingPageMediaFormSchema } from "@/lib/validators";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import * as z from "zod";

const utapi = new UTApi();

export async function manageLandingPageMedia(data: z.infer<typeof LandingPageMediaFormSchema>) {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const result = LandingPageMediaFormSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid data" };
    }

    const incomingMedia = result.data.landingPageMedia;

    try {
        // Ensure there's a LandingPage record, or create one if it doesn't exist.
        let landingPage = await db.landingPage.findFirst();
        if (!landingPage) {
            landingPage = await db.landingPage.create({ data: {} });
        }

        const existingLandingPageMedia = await db.landingPageMedia.findMany({
            where: { landingPageId: landingPage.id },
            include: { mediaAsset: true },
        });
        const existingMediaIds = new Set(existingLandingPageMedia.map((media) => media.id));

        const incomingIds = new Set();
        const mediaAssetsToDelete: string[] = [];

        for (const media of incomingMedia) {
            const mediaAssetConnect = media.mediaAssetId ? { connect: { id: media.mediaAssetId } } : undefined;

            if (media.mediaId && existingMediaIds.has(media.mediaId)) {
                // Update existing media
                const existingItem = existingLandingPageMedia.find((e) => e.id === media.mediaId);

                // If updating media asset, mark old media asset for deletion
                if (
                    media.mediaAssetId &&
                    existingItem?.mediaAsset &&
                    existingItem.mediaAsset.id !== media.mediaAssetId
                ) {
                    mediaAssetsToDelete.push(existingItem.mediaAsset.key);
                }

                await db.landingPageMedia.update({
                    where: { id: media.mediaId },
                    data: {
                        landingPage: { connect: { id: landingPage.id } },
                        ...(mediaAssetConnect && { mediaAsset: mediaAssetConnect }),
                    },
                });
                incomingIds.add(media.mediaId);
            } else {
                // Create new media item
                if (!mediaAssetConnect) {
                    // Skip if no media asset is provided for a new item (it's required)
                    continue;
                }

                await db.landingPageMedia.create({
                    data: {
                        landingPage: { connect: { id: landingPage.id } },
                        mediaAsset: mediaAssetConnect,
                    },
                });
            }
        }

        // Identify media items to delete
        const itemsToDelete = existingLandingPageMedia.filter((media) => !incomingIds.has(media.id));

        for (const media of itemsToDelete) {
            if (media.mediaAsset) {
                mediaAssetsToDelete.push(media.mediaAsset.key);
            }
            await db.landingPageMedia.delete({ where: { id: media.id } });
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
                console.error("Failed to delete old landing page media files:", error);
            }
        }

        revalidatePath("/dashboard/cms");
        revalidatePath("/");

        return { success: "Landing page media managed successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
}
