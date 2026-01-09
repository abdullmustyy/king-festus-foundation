"use client";

import { toggleUserStatus, updateUserRole } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/generated/prisma/client";
import { UserRole } from "@/generated/prisma/enums";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UsersColumnActionsProps {
    user: User;
    currentUserRole: UserRole;
}

export function UsersColumnActions({ user, currentUserRole }: UsersColumnActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

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

    const handleStatusToggle = async () => {
        setIsLoading(true);

        try {
            const result = await toggleUserStatus(user.id, !user.isActive);

            if (result.success) {
                toast.success(`User ${user.isActive ? "deactivated" : "activated"} successfully`);
                setIsStatusDialogOpen(false);
            } else {
                toast.error(result.error || `Failed to ${user.isActive ? "deactivate" : "activate"} user`);
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button disabled={isLoading} isLoading={isLoading} variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => handleRoleUpdate("USER")}
                        disabled={isLoading || user.role === "USER"}
                    >
                        Demote to User
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleRoleUpdate("ADMIN")}
                        disabled={isLoading || user.role === "ADMIN"}
                    >
                        Promote to Admin
                    </DropdownMenuItem>

                    {currentUserRole === "SUPER_ADMIN" && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setIsStatusDialogOpen(true)}
                                disabled={isLoading}
                                className={
                                    user.isActive
                                        ? "text-red-600 focus:text-red-600"
                                        : "text-green-600 focus:text-green-600"
                                }
                            >
                                {user.isActive ? "Deactivate User" : "Activate User"}
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{user.isActive ? "Deactivate User" : "Activate User"}</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {user.isActive ? "deactivate" : "activate"}{" "}
                            <span className="font-medium text-foreground">{user.fullName || "this user"}</span>?
                            {user.isActive
                                ? " They will rely on an admin to reactivate their account to regain access."
                                : " They will regain access to the platform immediately."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            className="text-sm"
                            onClick={() => setIsStatusDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={user.isActive ? "destructive" : "default"}
                            disabled={isLoading}
                            isLoading={isLoading}
                            className="text-sm"
                            onClick={handleStatusToggle}
                        >
                            {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
