import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import z from "zod";

const f = createUploadthing();

export const ourFileRouter = {
    media: f(["image"])
        .input(z.object({ description: z.string().optional() }))
        .middleware(async ({ input }) => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("You must be logged in to add an image to your gallery");

            return { userId: user.id, input };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const { input } = metadata;

            await db.media.create({
                data: {
                    key: file.key,
                    name: file.name,
                    url: file.ufsUrl,
                    description: input.description,
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
            const existing = await db.landingPage.findFirst();

            if (existing) {
                await db.landingPage.update({
                    where: { id: existing.id },
                    data: { heroImage: file.ufsUrl },
                });
            } else {
                await db.landingPage.create({
                    data: { heroImage: file.ufsUrl },
                });
            }

            revalidatePath("/");
        }),
} satisfies FileRouter;

export const utapi = new UTApi();

export type OurFileRouter = typeof ourFileRouter;
