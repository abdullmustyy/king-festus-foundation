"use server";

import db from "@/lib/db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    try {
        const user = await currentUser();

        if (!user) {
            return { error: "Unauthorized" };
        }

        const email = user.emailAddresses[0]?.emailAddress;

        if (!email) {
            return { error: "No email found for user" };
        }

        const dbUser = await db.user.upsert({
            where: { email },
            update: {
                fullName: `${user.firstName} ${user.lastName}`,
            },
            create: {
                id: user.id, // Use Clerk ID as DB ID
                email,
                fullName: `${user.firstName} ${user.lastName}`,
            },
        });

        const client = await clerkClient();
        await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
                role: dbUser.role,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error syncing user:", error);
        return { error: "Failed to sync user data" };
    }
}
