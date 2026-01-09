"use server";

import { utapi } from "@/app/api/uploadthing/core";
import { UserRole } from "@/generated/prisma/enums";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteMediaAction(mediaId: string) {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await db.user.findUnique({
        where: { email: user.emailAddresses[0].emailAddress },
    });

    if (!dbUser) {
        return { error: "User not found" };
    }

    try {
        const media = await db.media.findUnique({
            where: { id: mediaId },
            include: {
                mediaAsset: {
                    include: {
                        _count: {
                            select: {
                                dashboardAds: true,
                                governanceBodies: true,
                                landingPageMedia: true,
                            },
                        },
                    },
                },
            },
        });

        if (!media) {
            return { error: "Media not found" };
        }

        // Authorization: Owner or Admin
        const isOwner = media.userId === user.id;
        const isAdmin = dbUser.role === UserRole.ADMIN || dbUser.role === UserRole.SUPER_ADMIN;

        if (!isOwner && !isAdmin) {
            return { error: "Forbidden: You do not have permission to delete this media" };
        }

        const { mediaAsset } = media;

        // Delete the Media entry (removes it from the gallery)
        await db.media.delete({
            where: { id: mediaId },
        });

        // Check if the underlying asset is used elsewhere
        const isUsedElsewhere =
            mediaAsset &&
            (mediaAsset._count.dashboardAds > 0 ||
                mediaAsset._count.governanceBodies > 0 ||
                mediaAsset._count.landingPageMedia > 0);

        // If not used elsewhere, cleanup the asset and the file
        if (mediaAsset && !isUsedElsewhere) {
            await db.mediaAsset.delete({
                where: { id: mediaAsset.id },
            });

            try {
                await utapi.deleteFiles(mediaAsset.key);
            } catch (utError) {
                console.error("Failed to delete file from UploadThing:", utError);
            }
        }

        revalidatePath("/dashboard/media");
        return { success: true };
    } catch (error) {
        console.error("Error deleting media:", error);
        return { error: "Failed to delete media" };
    }
}

export async function getUserMediaCount(userId: string) {
    const count = await db.media.count({
        where: {
            userId: userId,
        },
    });
    
    return count;
}
