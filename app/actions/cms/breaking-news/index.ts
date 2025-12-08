"use server";

import db from "@/lib/db";
import { BreakingNewsFormSchema } from "@/lib/validators";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export async function createBreakingNews(data: z.infer<typeof BreakingNewsFormSchema>) {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const result = BreakingNewsFormSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid data" };
    }

    const { headline, linkUrl, startDate, endDate, status } = result.data;

    try {
        await db.breakingNews.create({
            data: {
                headline,
                linkUrl,
                startDate,
                endDate,
                status,
            },
        });

        revalidatePath("/dashboard/cms");
        return { success: "Breaking news created successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong" };
    }
}
