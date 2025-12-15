"use server";

import db from "@/lib/db";
import { AboutUsFormSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

const utapi = new UTApi();

export async function updateAboutUs(data: z.infer<typeof AboutUsFormSchema>) {
    const result = AboutUsFormSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid input data" };
    }

    const { content, missions, media: incomingMedia } = result.data;

    try {
        let aboutUs = await db.aboutUs.findFirst();

        if (!aboutUs) {
            aboutUs = await db.aboutUs.create({
                data: {
                    vision: content,
                    missions: {
                        create: missions.map((m) => ({ text: m.text })),
                    },
                },
            });
        } else {
            await db.aboutUs.update({
                where: { id: aboutUs.id },
                data: {
                    vision: content,
                    missions: {
                        deleteMany: {},
                        create: missions.map((m) => ({ text: m.text })),
                    },
                },
            });
        }

        // Handle Media
        if (incomingMedia) {
            const existingAboutUsMedia = await db.aboutUsMedia.findMany({
                where: { aboutUsId: aboutUs.id },
                include: { mediaAsset: true },
            });
            const existingMediaIds = new Set(existingAboutUsMedia.map((media) => media.id));

            const incomingIds = new Set();
            const mediaAssetsToDelete: string[] = [];

            for (const media of incomingMedia) {
                const mediaAssetConnect = media.mediaAssetId ? { connect: { id: media.mediaAssetId } } : undefined;

                if (media.mediaId && existingMediaIds.has(media.mediaId)) {
                    // Update existing media
                    const existingItem = existingAboutUsMedia.find((e) => e.id === media.mediaId);

                    // If updating media asset, mark old media asset for deletion
                    if (
                        media.mediaAssetId &&
                        existingItem?.mediaAsset &&
                        existingItem.mediaAsset.id !== media.mediaAssetId
                    ) {
                        mediaAssetsToDelete.push(existingItem.mediaAsset.key);
                    }

                    await db.aboutUsMedia.update({
                        where: { id: media.mediaId },
                        data: {
                            aboutUs: { connect: { id: aboutUs.id } },
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

                    await db.aboutUsMedia.create({
                        data: {
                            aboutUs: { connect: { id: aboutUs.id } },
                            mediaAsset: mediaAssetConnect,
                        },
                    });
                }
            }

            // Identify media items to delete
            const itemsToDelete = existingAboutUsMedia.filter((media) => !incomingIds.has(media.id));

            for (const media of itemsToDelete) {
                if (media.mediaAsset) {
                    mediaAssetsToDelete.push(media.mediaAsset.key);
                }
                await db.aboutUsMedia.delete({ where: { id: media.id } });
            }

            // Cleanup unused media assets from UploadThing
            if (mediaAssetsToDelete.length > 0) {
                try {
                    await utapi.deleteFiles(mediaAssetsToDelete);
                    // Also clean up from DB if cascading delete didn't handle it (MediaAsset doesn't cascade delete from AboutUsMedia usually)
                    const keysToDelete = mediaAssetsToDelete;
                    await db.mediaAsset.deleteMany({
                        where: { key: { in: keysToDelete } },
                    });
                } catch (error) {
                    console.error("Failed to delete old about us media files:", error);
                }
            }
        }

        revalidatePath("/about-us");
        revalidatePath("/dashboard/cms");
        return { success: true };
    } catch (error) {
        console.error("Error updating About Us:", error);
        return { error: "Failed to update About Us section" };
    }
}
