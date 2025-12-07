"use server";

import db from "@/lib/db";
import { AddAdminFormSchema } from "@/lib/validators";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addAdmin(data: z.infer<typeof AddAdminFormSchema>) {
    const result = AddAdminFormSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid input data" };
    }

    const { fullName, email, password, role } = result.data;

    try {
        const client = await clerkClient();

        // Split full name into first and last name
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        // 1. Create user in Clerk
        const clerkUser = await client.users.createUser({
            firstName,
            lastName,
            emailAddress: [email],
            password,
            skipPasswordChecks: false,
            skipPasswordRequirement: false,
        });

        // 2. Create user in local DB
        await db.user.create({
            data: {
                id: clerkUser.id,
                email,
                fullName,
                role: role as "ADMIN" | "USER",
            },
        });

        revalidatePath("/dashboard/cms");

        return { success: true };
    } catch (error) {
        console.error("Error adding admin:", error);

        // Handle Clerk errors (e.g., password too short, email taken)
        if (isClerkAPIResponseError(error)) {
            const messages = error.errors.map((e) => e.longMessage).join(", ");
            return { error: messages };
        }

        return { error: "Failed to add admin user. Ensure email is unique." };
    }
}
