"use server";

import db from "@/lib/db";
import { BreakingNewsFormSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateBreakingNews(data: z.infer<typeof BreakingNewsFormSchema>) {
    const result = BreakingNewsFormSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid input data" };
    }

    const { headline, linkUrl, startDate, endDate, status } = result.data;

    try {
        const existing = await db.breakingNews.findFirst();

        if (existing) {
            await db.breakingNews.update({
                where: { id: existing.id },
                data: {
                    headline,
                    linkUrl,
                    startDate,
                    endDate,
                    status,
                },
            });
        } else {
            await db.breakingNews.create({
                data: {
                    headline,
                    linkUrl,
                    startDate,
                    endDate,
                    status,
                },
            });
        }

        revalidatePath("/dashboard/cms");

        return { success: true };
    } catch (error) {
        console.error("Error updating Breaking News:", error);
        return { error: "Failed to update Breaking News" };
    }
}
