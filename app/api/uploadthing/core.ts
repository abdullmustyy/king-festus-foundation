import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import z from "zod";

const f = createUploadthing();

export const ourFileRouter = {
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

    governanceBodyImage: f(["image"])
        .input(z.object({ name: z.string(), role: z.string() }))
        .middleware(async ({ input }) => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to add a governance body member");

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

            // 2. Create the GovernanceBody record and link the image
            await db.governanceBody.create({
                data: {
                    name: input.name,
                    role: input.role,
                    image: {
                        connect: { id: newImage.id },
                    },
                },
            });

            revalidatePath("/governance-structure");
        }),

    landingPageHeroImage: f(["image"])
        .middleware(async () => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to upload a landing page hero image");

            return { userId: user.id };
        })
        .onUploadComplete(async ({ file }) => {
            const existingLandingPage = await db.landingPage.findFirst({
                include: { heroImage: true }, // Include the related Image record
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
                // If a LandingPage exists and it had a previous heroImage,
                // delete the old Image record from the database and from UploadThing
                if (existingLandingPage.heroImage && existingLandingPage.heroImage.key) {
                    await utapi.deleteFiles(existingLandingPage.heroImage.key); // Delete from UploadThing
                    await db.image.delete({ where: { id: existingLandingPage.heroImage.id } }); // Delete from DB
                }

                await db.landingPage.update({
                    where: { id: existingLandingPage.id },
                    data: {
                        heroImage: {
                            connect: { id: newImage.id },
                        },
                    },
                });
            } else {
                // Create a new LandingPage and connect the new Image
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
