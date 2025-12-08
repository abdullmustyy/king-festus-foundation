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

    dashboardAdMedia: f({ image: { maxFileSize: "8MB" }, video: { maxFileSize: "32MB" } })
        .middleware(async ({ files }) => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to add a dashboard ad");

            const type = files[0].type.startsWith("video/") ? ("VIDEO" as const) : ("IMAGE" as const);

            return { userId: user.id, type };
        })
        .onUploadComplete(async ({ metadata, file }) => {
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

            return {
                id: newMediaAsset.id,
                key: newMediaAsset.key,
                name: newMediaAsset.name,
                url: newMediaAsset.url,
                type: newMediaAsset.type,
            };
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
