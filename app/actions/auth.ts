"use server";

import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    try {
        const user = await currentUser();

        if (!user) {
            return { error: "Unauthorized" };
        }

        const email = user.emailAddresses[0].emailAddress;

        if (!email) {
            return { error: "No email found for user" };
        }

        const existingUser = await db.user.findUnique({
            where: { id: user.id },
        });

        if (!existingUser) {
            await db.user.create({
                data: {
                    id: user.id, // Use Clerk ID as DB ID
                    email,
                    fullName: `${user.firstName} ${user.lastName}`,
                },
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error syncing user:", error);

        return { error: "Failed to sync user data" };
    }
}
