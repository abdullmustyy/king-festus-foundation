import { z } from "zod";

export const UpdateDashboardAdSchema = z.object({
    adId: z.string().min(1, "Ad ID is required"),
    title: z.string().min(1, "Title is required"),
    status: z.boolean(),
});
