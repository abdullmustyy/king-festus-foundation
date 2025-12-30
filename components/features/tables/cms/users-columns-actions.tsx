"use client";

import { updateUserRole } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/generated/prisma/client";
import { UserRole } from "@/generated/prisma/enums";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UsersColumnActionsProps {
    user: User;
}

export function UsersColumnActions({ user }: UsersColumnActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleUpdate = async (newRole: UserRole) => {
        if (user.role === newRole) return;

        setIsLoading(true);

        try {
            const result = await updateUserRole(user.id, newRole);

            if (result.success) {
                toast.success(`User role updated to ${newRole}`);
            } else {
                toast.error(result.error || "Failed to update role");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button disabled={isLoading} isLoading={isLoading} variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRoleUpdate("USER")} disabled={isLoading || user.role === "USER"}>
                    Demote to User
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleRoleUpdate("ADMIN")}
                    disabled={isLoading || user.role === "ADMIN"}
                >
                    Promote to Admin
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
