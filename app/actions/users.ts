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

    if (!dbUser || (dbUser.role !== "ADMIN" && dbUser.role !== "SUPER_ADMIN")) {
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

    if (!dbUser || (dbUser.role !== "ADMIN" && dbUser.role !== "SUPER_ADMIN")) {
        throw new Error("Unauthorized: Admin access required");
    }

    // Role Hierarchy Logic
    // 1. Only Super Admin can promote/demote to/from ADMIN or SUPER_ADMIN (though current UI only allows promo to Admin)
    // 2. Admin cannot change role of another Admin or Super Admin

    // If target role is ADMIN or SUPER_ADMIN, requester must be SUPER_ADMIN
    if ((role === "ADMIN" || role === "SUPER_ADMIN") && dbUser.role !== "SUPER_ADMIN") {
        return { success: false, error: "Only Super Admins can promote to Admin" };
    }

    // Check target user's current role
    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (!targetUser) return { success: false, error: "User not found" };

    // If target user is already ADMIN or SUPER_ADMIN, only SUPER_ADMIN can change their role
    if ((targetUser.role === "ADMIN" || targetUser.role === "SUPER_ADMIN") && dbUser.role !== "SUPER_ADMIN") {
        return { success: false, error: "Insufficient permissions to modify this user" };
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

export async function toggleUserStatus(userId: string, isActive: boolean) {
    const user = await currentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const dbUser = await db.user.findUnique({
        where: { id: user.id },
    });

    if (!dbUser || dbUser.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized: Super Admin access required");
    }

    if (user.id === userId) {
        return { success: false, error: "You cannot deactivate your own account" };
    }

    try {
        await db.user.update({
            where: { id: userId },
            data: { isActive },
        });

        revalidatePath("/dashboard/cms");

        return { success: true };
    } catch (error) {
        console.error("Failed to update user status:", error);
        return { success: false, error: "Failed to update user status" };
    }
}
