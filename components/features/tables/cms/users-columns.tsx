"use client";

import { UsersColumnActions } from "@/components/features/tables/cms/users-columns-actions";
import { User } from "@/generated/prisma/client";
import { UserRole } from "@/generated/prisma/enums";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

const roleMap: Record<UserRole, string> = {
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
    USER: "User",
};

export const getUsersColumns = (currentUserRole: UserRole): ColumnDef<User>[] => [
    {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }) => {
            const name = row.original.fullName || "N/A";
            return <span className="font-medium">{name}</span>;
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            return (
                <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        row.original.role === "SUPER_ADMIN"
                            ? "bg-primary/30"
                            : row.original.role === "ADMIN"
                              ? "bg-primary/20"
                              : "bg-muted/20"
                    }`}
                >
                    {roleMap[row.original.role]}
                </span>
            );
        },
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            return (
                <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        row.original.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                    {row.original.isActive ? "Active" : "Inactive"}
                </span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => {
            return <span>{format(new Date(row.original.createdAt), "dd/MM/yy")}</span>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <UsersColumnActions user={row.original} currentUserRole={currentUserRole} />,
    },
];
