"use client";

import { UsersColumnActions } from "@/components/features/tables/cms/users-columns-actions";
import { User } from "@/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const usersColumns: ColumnDef<User>[] = [
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
                        row.original.role === "ADMIN" ? "bg-primary/20" : "bg-muted/20"
                    }`}
                >
                    {row.original.role}
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
        cell: ({ row }) => <UsersColumnActions user={row.original} />,
    },
];
