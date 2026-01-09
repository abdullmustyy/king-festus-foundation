"use client";

import { getUsersColumns } from "@/components/features/tables/cms/users-columns";
import { DataTable } from "@/components/features/tables/data-table/data-table";
import Search from "@/components/ui/icons/search";
import { Input } from "@/components/ui/input";
import { User } from "@/generated/prisma/client";
import { UserRole } from "@/generated/prisma/enums";
import { useDataTable } from "@/hooks/use-data-table";
import { useMemo, useState } from "react";

interface UsersTableProps {
    data: User[];
    currentUserRole: UserRole;
}

export function UsersTable({ data, currentUserRole }: UsersTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const columns = useMemo(() => getUsersColumns(currentUserRole), [currentUserRole]);

    const filteredData = useMemo(() => {
        return data.filter(
            (user) =>
                user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [data, searchQuery]);

    const { table } = useDataTable({
        data: filteredData,
        columns,
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
