"use server";

import db from "@/lib/db";
import { AboutUsFormSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateAboutUs(data: z.infer<typeof AboutUsFormSchema>) {
    const result = AboutUsFormSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid input data" };
    }

    const { content, missions } = result.data;

    try {
        const existing = await db.aboutUs.findFirst();

        if (existing) {
            await db.aboutUs.update({
                where: { id: existing.id },
                data: {
                    vision: content,
                    missions: {
                        deleteMany: {},
                        create: missions.map((m) => ({ text: m.text })),
                    },
                },
            });
        } else {
            await db.aboutUs.create({
                data: {
                    vision: content,
                    missions: {
                        create: missions.map((m) => ({ text: m.text })),
                    },
                },
            });
        }

        revalidatePath("/about-us");
        return { success: true };
    } catch (error) {
        console.error("Error updating About Us:", error);
        return { error: "Failed to update About Us section" };
    }
}
