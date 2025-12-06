"use server";

import { utapi } from "@/app/api/uploadthing/core";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { UpdateGovernanceStructureSchema } from "./schema";

export async function updateGovernanceStructure(data: z.infer<typeof UpdateGovernanceStructureSchema>) {
    const result = UpdateGovernanceStructureSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid input data" };
    }

    const { governanceBodies } = result.data;

    try {
        await db.$transaction(async (tx) => {
            // 1. Fetch current state
            const currentBodies = await tx.governanceBody.findMany({
                include: { mediaAsset: true },
            });

            const incomingIds = new Set(
                governanceBodies.map((b) => b.id).filter((id): id is string => typeof id === "string" && id.length > 0),
            );

            // 2. Identify Deletions (Records in DB but not in Submission)
            const bodiesToDelete = currentBodies.filter((b) => !incomingIds.has(b.id));
            const bodyIdsToDelete = bodiesToDelete.map((b) => b.id);

            // 3. Handle Orphaned Images from DELETED bodies
            // We collect media asset IDs/Keys to delete.
            const mediaAssetsToDelete: { id: string; key: string }[] = [];

            for (const body of bodiesToDelete) {
                if (body.mediaAsset) {
                    // Check if this image is reused in the NEW submission (unlikely but possible if URLs match)
                    const isReused = governanceBodies.some((newBody) => newBody.mediaAssetId === body.mediaAsset?.id);
                    if (!isReused) {
                        mediaAssetsToDelete.push({ id: body.mediaAsset.id, key: body.mediaAsset.key });
                    }
                }
            }

            // Delete the removed governance bodies
            if (bodyIdsToDelete.length > 0) {
                await tx.governanceBody.deleteMany({
                    where: { id: { in: bodyIdsToDelete } },
                });
            }

            // 4. Process Upserts (Update or Create)
            for (const body of governanceBodies) {
                let mediaAssetRecord;

                if (body.mediaAssetId) {
                    mediaAssetRecord = await tx.mediaAsset.findUnique({
                        where: { id: body.mediaAssetId },
                    });
                } else {
                    // This case should ideally not happen if mediaAssetId is always passed.
                    // If it does, it means a new image was uploaded but ID was not captured, or old data.
                    // For robustness, we could create a new MediaAsset here, but it implies a broken flow.
                    // For now, let's assume mediaAssetId is always provided for images.
                    // If it's a new upload, the form should have provided a new ID.
                    // If it's an existing image, initialData should have provided an ID.
                    // Hence, if mediaAssetId is missing, it's an error or a legacy image not properly migrated.
                    // For current purpose, let's just create a new one, this will lead to duplicate mediaAsset
                    // but will not break the flow.
                    mediaAssetRecord = await tx.mediaAsset.create({
                        data: {
                            key: body.image, // Assuming body.image is actually the key or url is sufficient
                            name: body.name + "_media",
                            url: body.image,
                            type: "IMAGE", // Default to IMAGE if type is not available
                        },
                    });
                }

                if (!mediaAssetRecord) {
                    // If mediaAssetId was provided but not found, this is an error.
                    // Or if body.image failed to create a mediaAsset.
                    throw new Error(`Media asset not found or created for ID: ${body.mediaAssetId || body.image}`);
                }

                if (body.id && incomingIds.has(body.id)) {
                    // UPDATE existing record
                    const existingBody = currentBodies.find((b) => b.id === body.id);

                    if (existingBody) {
                        // Check if mediaAsset has changed
                        if (existingBody.mediaAssetId !== mediaAssetRecord.id) {
                            // Old mediaAsset might need deletion if not used elsewhere
                            const oldMediaAssetIsReused = governanceBodies.some(
                                (nb) => nb.mediaAssetId === existingBody.mediaAsset?.id,
                            );
                            if (!oldMediaAssetIsReused && existingBody.mediaAsset) {
                                mediaAssetsToDelete.push({
                                    id: existingBody.mediaAsset.id,
                                    key: existingBody.mediaAsset.key,
                                });
                            }
                        }

                        await tx.governanceBody.update({
                            where: { id: body.id },
                            data: {
                                name: body.name,
                                role: body.role,
                                mediaAssetId: mediaAssetRecord.id,
                            },
                        });
                    }
                } else {
                    // CREATE new record
                    await tx.governanceBody.create({
                        data: {
                            name: body.name,
                            role: body.role,
                            mediaAssetId: mediaAssetRecord.id,
                        },
                    });
                }
            }

            // 5. Execute MediaAsset Deletions
            if (mediaAssetsToDelete.length > 0) {
                // Unique mediaAssets only
                const uniqueMediaAssetsToDelete = Array.from(
                    new Map(mediaAssetsToDelete.map((item) => [item.id, item])).values(),
                );
                const mediaAssetIdsToDelete = uniqueMediaAssetsToDelete.map((img) => img.id);
                const mediaAssetKeysToDelete = uniqueMediaAssetsToDelete.map((img) => img.key);

                await tx.mediaAsset.deleteMany({
                    where: { id: { in: mediaAssetIdsToDelete } },
                });

                try {
                    await utapi.deleteFiles(mediaAssetKeysToDelete);
                } catch (utError) {
                    console.error("Failed to delete files from UploadThing:", utError);
                }
            }
        });

        revalidatePath("/governance-structure");
        return { success: true };
    } catch (error) {
        console.error("Error updating Governance Structure:", error);
        return { error: "Failed to update Governance Structure" };
    }
}
