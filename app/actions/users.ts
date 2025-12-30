"use server";

import { UserRole } from "@/generated/prisma/enums";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const dbUser = await db.user.findUnique({
        where: { id: user.id },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }

    const users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return users;
}

export async function updateUserRole(userId: string, role: UserRole) {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const dbUser = await db.user.findUnique({
        where: { id: user.id },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }

    try {
        await db.user.update({
            where: { id: userId },
            data: { role },
        });

        revalidatePath("/dashboard/cms");

        return { success: true };
    } catch (error) {
        console.error("Failed to update user role:", error);
        return { success: false, error: "Failed to update user role" };
    }
}
