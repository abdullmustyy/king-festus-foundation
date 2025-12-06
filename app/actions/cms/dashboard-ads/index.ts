"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { UpdateDashboardAdSchema } from "./schema";

export async function updateDashboardAd(data: z.infer<typeof UpdateDashboardAdSchema>) {
    const result = UpdateDashboardAdSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid input data" };
    }

    const { adId, title, status } = result.data;

    try {
        await db.dashboardAd.update({
            where: { id: adId },
            data: {
                title,
                status,
            },
        });

        revalidatePath("/dashboard/cms");

        return { success: true };
    } catch (error) {
        console.error("Error updating Dashboard Ad:", error);
        return { error: "Failed to update Dashboard Ad" };
    }
}
