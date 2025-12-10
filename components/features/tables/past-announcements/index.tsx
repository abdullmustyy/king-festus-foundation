"use client";

import { DataTable } from "@/components/features/tables/data-table/data-table";
import Search from "@/components/ui/icons/search";
import { Input } from "@/components/ui/input";
import { BreakingNews } from "@/generated/prisma/client";
import { useDataTable } from "@/hooks/use-data-table";
import { useState } from "react";
import { pastAnnouncementsColumns } from "./columns";

interface IPastAnnouncementsTableProps {
    data: BreakingNews[];
}

export function PastAnnouncementsTable({ data }: IPastAnnouncementsTableProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = data.filter((item) => item.headline.toLowerCase().includes(searchQuery.toLowerCase()));

    const { table } = useDataTable({
        data: filteredData,
        columns: pastAnnouncementsColumns,
        pageCount: 1,
        getRowId: (row) => row.id,
    });

    return (
        <section className="py-5">
            <DataTable table={table} className="gap-2.5 lg:px-5">
                <div className="flex items-center justify-between px-4 lg:p-0">
                    <div className="relative w-full">
                        <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#7F7F7F]" />
                        <Input
                            placeholder="Search announcements"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 rounded-none border-x-0 border-t-0 border-b pl-9"
                        />
                    </div>
                </div>
            </DataTable>
        </section>
    );
}
