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

            const dbUser = await db.user.findUnique({
                where: { id: user.id },
                select: { role: true },
            });

            if (dbUser?.role === "USER") {
                const count = await db.media.count({
                    where: { userId: user.id },
                });

                if (count >= 10) {
                    throw new UploadThingError("Storage limit reached (10 images). Delete some images to upload more.");
                }
            }

            return { userId: user.id, input, type: "IMAGE" as const };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const { input, type, userId } = metadata;

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
                    userId: userId,
                    mediaAssetId: newMediaAsset.id,
                },
            });

            revalidatePath("/dashboard/media");
        }),

    landingPageMedia: f(["image"])
        .middleware(async () => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to upload landing page media");

            return { userId: user.id, type: "IMAGE" as const };
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

    aboutUsMedia: f(["image"])
        .middleware(async () => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to upload about us media");

            return { userId: user.id, type: "IMAGE" as const };
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

            revalidatePath("/dashboard/cms");

            return {
                id: newMediaAsset.id,
                key: newMediaAsset.key,
                name: newMediaAsset.name,
                url: newMediaAsset.url,
                type: newMediaAsset.type,
            };
        }),
} satisfies FileRouter;

export const utapi = new UTApi();

export type OurFileRouter = typeof ourFileRouter;
