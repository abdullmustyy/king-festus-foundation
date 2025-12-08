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

        // Check if user already exists
        const existingUsers = await client.users.getUserList({ emailAddress: [email] });

        if (existingUsers.data.length > 0) {
            // User exists, update role
            const user = existingUsers.data[0];

            await db.user.update({
                where: { id: user.id },
                data: {
                    role,
                },
            });
        } else {
            // User does not exist, create new user
            // Split full name into first and last name
            const nameParts = fullName.trim().split(/\s+/);
            const firstName = nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

            const clerkUser = await client.users.createUser({
                firstName,
                lastName,
                emailAddress: [email],
                password,
                skipPasswordChecks: false,
                skipPasswordRequirement: false,
            });

            // Verify the email address to allow sign-in
            if (clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0) {
                const emailObj = clerkUser.emailAddresses.find((e) => e.emailAddress === email);
                if (emailObj) {
                    await client.emailAddresses.updateEmailAddress(emailObj.id, {
                        verified: true,
                    });
                }
            }

            // Create user in DB
            await db.user.create({
                data: {
                    id: clerkUser.id,
                    email,
                    fullName,
                    role: role as "ADMIN" | "USER",
                },
            });
        }

        revalidatePath("/dashboard/cms");

        return { success: true };
    } catch (error) {
        console.error("Error adding admin:", error);

        // Handle Clerk errors
        if (isClerkAPIResponseError(error)) {
            const messages = error.errors.map((e) => e.longMessage).join(", ");
            return { error: messages };
        }

        return { error: "Failed to add admin user." };
    }
}
