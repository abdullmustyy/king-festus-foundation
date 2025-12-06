import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import z from "zod";

const f = createUploadthing();

export const ourFileRouter = {
    governanceBodyImage: f(["image"])
        .middleware(async () => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to upload an image");

            // We explicitly set type to IMAGE because this route is for images only
            return { userId: user.id, type: "IMAGE" as const };
        })
        .onUploadComplete(async ({ file, metadata }) => {
            const { type } = metadata;
            // Create the new MediaAsset record
            const newMediaAsset = await db.mediaAsset.create({
                data: {
                    key: file.key,
                    name: file.name,
                    url: file.ufsUrl,
                    type: type,
                },
            });

            revalidatePath("/dashboard/cms");

            return {
                id: newMediaAsset.id,
                key: newMediaAsset.key,
                name: newMediaAsset.name,
                url: newMediaAsset.url,
                type: newMediaAsset.type,
            };
        }),

    dashboardAdMedia: f({ image: { maxFileSize: "2MB" }, video: { maxFileSize: "8MB" } })
        .input(z.object({ title: z.string(), status: z.boolean(), adId: z.string().optional() }))
        .middleware(async ({ input, files }) => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to add a dashboard ad");

            const type = files[0].type.startsWith("video/") ? ("VIDEO" as const) : ("IMAGE" as const);

            return { userId: user.id, input, type };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const { input, type } = metadata;

            const mediaAssetToDelete: { id: string; key: string }[] = [];
            const dashboardAdToDelete: string[] = [];

            // Step 1: Handle cleanup for existing ad if it's an update
            if (input.adId) {
                const existingAd = await db.dashboardAd.findUnique({
                    where: { id: input.adId },
                    include: { mediaAsset: true },
                });

                if (existingAd && existingAd.mediaAsset && existingAd.mediaAsset.key !== file.key) {
                    // If mediaAsset is being replaced, add old one to deletion list
                    mediaAssetToDelete.push({
                        id: existingAd.mediaAsset.id,
                        key: existingAd.mediaAsset.key,
                    });
                }
            } else {
                // Step 2: Aggressive cleanup if this is a CREATE scenario (no adId provided)
                // Delete ALL existing DashboardAds and their MediaAssets to enforce single active ad policy
                const allExistingAds = await db.dashboardAd.findMany({
                    include: { mediaAsset: true },
                });

                allExistingAds.forEach((ad) => {
                    dashboardAdToDelete.push(ad.id);
                    if (ad.mediaAsset) {
                        mediaAssetToDelete.push({
                            id: ad.mediaAsset.id,
                            key: ad.mediaAsset.key,
                        });
                    }
                });
            }

            // Step 3: Create the new MediaAsset record
            const newMediaAsset = await db.mediaAsset.create({
                data: {
                    key: file.key,
                    name: file.name,
                    url: file.ufsUrl,
                    type: type,
                },
            });

            // Step 4: Perform Upsert for DashboardAd
            if (input.adId) {
                // UPDATE existing DashboardAd
                await db.dashboardAd.update({
                    where: { id: input.adId },
                    data: {
                        title: input.title,
                        status: input.status,
                        mediaAsset: {
                            connect: { id: newMediaAsset.id },
                        },
                    },
                });
            } else {
                // CREATE new DashboardAd
                await db.dashboardAd.create({
                    data: {
                        title: input.title,
                        status: input.status,
                        mediaAsset: {
                            connect: { id: newMediaAsset.id },
                        },
                    },
                });
            }

            // Step 5: Execute MediaAsset Deletions (from update or create scenarios)
            if (mediaAssetToDelete.length > 0) {
                const uniqueMediaAssetsToDelete = Array.from(
                    new Map(mediaAssetToDelete.map((item) => [item.id, item])).values(),
                );
                const mediaAssetIdsToDelete = uniqueMediaAssetsToDelete
                    .map((m) => m.id)
                    .filter((id) => id !== newMediaAsset.id); // Ensure new mediaAsset is not deleted

                if (mediaAssetIdsToDelete.length > 0) {
                    await db.mediaAsset.deleteMany({
                        where: { id: { in: mediaAssetIdsToDelete } },
                    });
                }

                const mediaAssetKeysToDelete = uniqueMediaAssetsToDelete
                    .map((m) => m.key)
                    .filter((key) => key !== newMediaAsset.key); // Ensure new mediaAsset key is not deleted

                if (mediaAssetKeysToDelete.length > 0) {
                    try {
                        await utapi.deleteFiles(mediaAssetKeysToDelete);
                    } catch (error) {
                        console.error("Failed to delete old dashboard ad files from UploadThing:", error);
                    }
                }
            }

            // Step 6: Delete old DashboardAd records if in create scenario
            if (dashboardAdToDelete.length > 0) {
                await db.dashboardAd.deleteMany({
                    where: { id: { in: dashboardAdToDelete } },
                });
            }

            revalidatePath("/dashboard/cms");
        }),

    media: f(["image"])
        .input(z.object({ description: z.string().optional() }))
        .middleware(async ({ input }) => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to add an image to your gallery");

            return { userId: user.id, input, type: "IMAGE" as const };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const { input, type } = metadata;

            // 1. Create the new MediaAsset record
            const newMediaAsset = await db.mediaAsset.create({
                data: {
                    key: file.key,
                    name: file.name,
                    url: file.ufsUrl,
                    type: type,
                },
            });

            // 2. Create the Media record and link the mediaAsset
            await db.media.create({
                data: {
                    description: input.description,
                    mediaAsset: {
                        connect: { id: newMediaAsset.id },
                    },
                },
            });

            revalidatePath("/dashboard/media");
        }),

    landingPageHeroImage: f(["image"])
        .middleware(async () => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to upload a landing page hero image");

            return { userId: user.id, type: "IMAGE" as const };
        })
        .onUploadComplete(async ({ file, metadata }) => {
            const { type } = metadata;

            const existingLandingPage = await db.landingPage.findFirst({
                include: { heroMediaAsset: true },
            });

            // 1. Create the new MediaAsset record
            const newMediaAsset = await db.mediaAsset.create({
                data: {
                    key: file.key,
                    name: file.name,
                    url: file.ufsUrl,
                    type: type,
                },
            });

            if (existingLandingPage) {
                const oldMediaAssetId = existingLandingPage.heroMediaAsset?.id;
                const oldMediaAssetKey = existingLandingPage.heroMediaAsset?.key;

                // 2. Update LandingPage to point to the new mediaAsset FIRST
                // This removes the reference to the old mediaAsset
                await db.landingPage.update({
                    where: { id: existingLandingPage.id },
                    data: {
                        heroMediaAsset: {
                            connect: { id: newMediaAsset.id },
                        },
                    },
                });

                // 3. Now it is safe to delete the old mediaAsset
                if (oldMediaAssetId && oldMediaAssetKey) {
                    await utapi.deleteFiles(oldMediaAssetKey);
                    await db.mediaAsset.delete({ where: { id: oldMediaAssetId } });
                }
            } else {
                await db.landingPage.create({
                    data: {
                        heroMediaAsset: {
                            connect: { id: newMediaAsset.id },
                        },
                    },
                });
            }

            revalidatePath("/");
        }),
} satisfies FileRouter;

export const utapi = new UTApi();

export type OurFileRouter = typeof ourFileRouter;
