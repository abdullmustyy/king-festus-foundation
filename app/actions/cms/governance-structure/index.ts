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
                include: { image: true },
            });

            const incomingIds = new Set(
                governanceBodies.map((b) => b.id).filter((id): id is string => typeof id === "string" && id.length > 0),
            );

            // 2. Identify Deletions (Records in DB but not in Submission)
            const bodiesToDelete = currentBodies.filter((b) => !incomingIds.has(b.id));
            const bodyIdsToDelete = bodiesToDelete.map((b) => b.id);

            // 3. Handle Orphaned Images from DELETED bodies
            // We collect image IDs/Keys to delete.
            const imagesToDelete: { id: string; key: string }[] = [];

            for (const body of bodiesToDelete) {
                if (body.image) {
                    // Check if this image is reused in the NEW submission (unlikely but possible if URLs match)
                    const isReused = governanceBodies.some((newBody) => newBody.image === body.image?.url);
                    if (!isReused) {
                        imagesToDelete.push({ id: body.image.id, key: body.image.key });
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
                // Resolve Image Record
                let imageRecord = await tx.image.findFirst({
                    where: {
                        OR: [{ key: body.image }, { url: body.image }],
                    },
                });

                if (!imageRecord) {
                    imageRecord = await tx.image.create({
                        data: {
                            key: body.image,
                            name: body.name + "_image",
                            url: body.image,
                        },
                    });
                }

                if (body.id && incomingIds.has(body.id)) {
                    // UPDATE existing record
                    const existingBody = currentBodies.find((b) => b.id === body.id);

                    if (existingBody) {
                        // Check if image has changed
                        if (existingBody.imageId !== imageRecord.id) {
                            // Old image might need deletion if not used elsewhere
                            // Ideally we check usage count, but for 1:1-ish logic:
                            // If the old image is not in the new list of images, delete it.
                            // (We handle this lazily or strict? Strict is better for cleanliness)
                            const oldImageIsReused = governanceBodies.some(
                                (nb) => nb.image === existingBody.image?.url,
                            );
                            if (!oldImageIsReused && existingBody.image) {
                                imagesToDelete.push({ id: existingBody.image.id, key: existingBody.image.key });
                            }
                        }

                        await tx.governanceBody.update({
                            where: { id: body.id },
                            data: {
                                name: body.name,
                                role: body.role,
                                imageId: imageRecord.id,
                            },
                        });
                    }
                } else {
                    // CREATE new record
                    await tx.governanceBody.create({
                        data: {
                            name: body.name,
                            role: body.role,
                            imageId: imageRecord.id,
                        },
                    });
                }
            }

            // 5. Execute Image Deletions
            if (imagesToDelete.length > 0) {
                // Unique images only
                const uniqueImagesToDelete = Array.from(
                    new Map(imagesToDelete.map((item) => [item.id, item])).values(),
                );
                const imageIdsToDelete = uniqueImagesToDelete.map((img) => img.id);
                const imageKeysToDelete = uniqueImagesToDelete.map((img) => img.key);

                await tx.image.deleteMany({
                    where: { id: { in: imageIdsToDelete } },
                });

                try {
                    await utapi.deleteFiles(imageKeysToDelete);
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
