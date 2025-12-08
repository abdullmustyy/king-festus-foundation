"use server";

import db from "@/lib/db";
import { BreakingNewsFormSchema } from "@/lib/validators";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export async function manageBreakingNews(data: z.infer<typeof BreakingNewsFormSchema>) {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const result = BreakingNewsFormSchema.safeParse(data);

    if (!result.success) {
        // console.error(result.error);
        return { error: "Invalid data" };
    }

    const incomingBreakingNews = result.data.breakingNews;

    try {
        const existingBreakingNews = await db.breakingNews.findMany({
            select: { id: true }, // Only need the IDs for comparison
        });
        const existingBreakingNewsIds = new Set(existingBreakingNews.map((item) => item.id));

        const updates = [];
        const creations = [];
        const incomingIds = new Set();

        for (const item of incomingBreakingNews) {
            if (item.id && existingBreakingNewsIds.has(item.id)) {
                // Item exists and needs to be updated
                updates.push(
                    db.breakingNews.update({
                        where: { id: item.id },
                        data: {
                            headline: item.headline,
                            linkUrl: item.linkUrl === "" ? null : item.linkUrl, // Convert empty string to null for optional URL
                            startDate: item.startDate,
                            endDate: item.endDate,
                            status: item.status,
                        },
                    }),
                );
                incomingIds.add(item.id);
            } else {
                // New item to be created
                creations.push(
                    db.breakingNews.create({
                        data: {
                            headline: item.headline,
                            linkUrl: item.linkUrl === "" ? null : item.linkUrl,
                            startDate: item.startDate,
                            endDate: item.endDate,
                            status: item.status,
                        },
                    }),
                );
            }
        }

        // Identify items to delete (exist in DB but not in incoming data)
        const deletions = existingBreakingNews
            .filter((item) => !incomingIds.has(item.id))
            .map((item) => db.breakingNews.delete({ where: { id: item.id } }));

        await db.$transaction([...updates, ...creations, ...deletions]);

        revalidatePath("/dashboard/cms");
        return { success: "Breaking news managed successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
}
