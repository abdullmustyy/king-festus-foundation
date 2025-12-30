"use client";

import { usersColumns } from "@/components/features/tables/cms/users-columns";
import { DataTable } from "@/components/features/tables/data-table/data-table";
import Search from "@/components/ui/icons/search";
import { Input } from "@/components/ui/input";
import { User } from "@/generated/prisma/client";
import { useDataTable } from "@/hooks/use-data-table";
import { useState } from "react";

interface UsersTableProps {
    data: User[];
}

export function UsersTable({ data }: UsersTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = data.filter(
        (user) =>
            user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const { table } = useDataTable({
        data: filteredData,
        columns: usersColumns,
    });

    return (
        <div className="space-y-4">
            <div className="relative md:w-4/5">
                <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#7F7F7F]" />
                <Input
                    placeholder="Search users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 rounded-none border-x-0 border-t-0 border-b pl-9"
                />
            </div>
            <DataTable table={table} withPagination />
        </div>
    );
}
