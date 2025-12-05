import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import z from "zod";

const f = createUploadthing();

export const ourFileRouter = {
    governanceBodyImage: f(["image"]) // Renamed from imageUploader
        .middleware(async () => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to upload an image");

            return { userId: user.id };
        })
        .onUploadComplete(async ({ file }) => {
            // Create the new Image record
            const newImage = await db.image.create({
                data: {
                    key: file.key,
                    name: file.name,
                    url: file.ufsUrl,
                },
            });
            return { id: newImage.id, key: newImage.key, name: newImage.name, url: newImage.url };
        }),

    dashboardAdImage: f(["image"])
        .input(z.object({ title: z.string(), status: z.boolean() }))
        .middleware(async ({ input }) => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to add a dashboard ad");

            return { userId: user.id, input };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const { input } = metadata;

            // 1. Create the new Image record
            const newImage = await db.image.create({
                data: {
                    key: file.key,
                    name: file.name,
                    url: file.ufsUrl,
                },
            });

            // 2. Create the DashboardAd record and link the image
            await db.dashboardAd.create({
                data: {
                    title: input.title,
                    status: input.status,
                    image: {
                        connect: { id: newImage.id },
                    },
                },
            });

            revalidatePath("/dashboard");
        }),

    media: f(["image"])
        .input(z.object({ description: z.string().optional() }))
        .middleware(async ({ input }) => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to add an image to your gallery");

            return { userId: user.id, input };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const { input } = metadata;

            // 1. Create the new Image record
            const newImage = await db.image.create({
                data: {
                    key: file.key,
                    name: file.name,
                    url: file.ufsUrl,
                },
            });

            // 2. Create the Media record and link the image
            await db.media.create({
                data: {
                    description: input.description,
                    image: {
                        connect: { id: newImage.id },
                    },
                },
            });

            revalidatePath("/dashboard/media");
        }),

    landingPageHeroImage: f(["image"])
        .middleware(async () => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to upload a landing page hero image");

            return { userId: user.id };
        })
        .onUploadComplete(async ({ file }) => {
            const existingLandingPage = await db.landingPage.findFirst({
                include: { heroImage: true },
            });

            // 1. Create the new Image record
            const newImage = await db.image.create({
                data: {
                    key: file.key,
                    name: file.name,
                    url: file.ufsUrl,
                },
            });

            if (existingLandingPage) {
                const oldImageId = existingLandingPage.heroImage?.id;
                const oldImageKey = existingLandingPage.heroImage?.key;

                // 2. Update LandingPage to point to the new image FIRST
                // This removes the reference to the old image
                await db.landingPage.update({
                    where: { id: existingLandingPage.id },
                    data: {
                        heroImage: {
                            connect: { id: newImage.id },
                        },
                    },
                });

                // 3. Now it is safe to delete the old image
                if (oldImageId && oldImageKey) {
                    await utapi.deleteFiles(oldImageKey);
                    await db.image.delete({ where: { id: oldImageId } });
                }
            } else {
                await db.landingPage.create({
                    data: {
                        heroImage: {
                            connect: { id: newImage.id },
                        },
                    },
                });
            }

            revalidatePath("/");
        }),
} satisfies FileRouter;

export const utapi = new UTApi();

export type OurFileRouter = typeof ourFileRouter;
