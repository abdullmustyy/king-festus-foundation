"use client";

import { DataTable } from "@/components/features/tables/data-table/data-table";
import Search from "@/components/ui/icons/search";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useMemo, useState } from "react";
import { cmsColumns, TCMS } from "./columns";

const initialData: TCMS[] = [
    { id: "1", title: "Media on landing page", lastUpdated: "23/11/25" },
    { id: "2", title: "Governance structure", lastUpdated: "23/11/25" },
    { id: "3", title: "About us", lastUpdated: "23/11/25" },
    { id: "4", title: "Scroll bar with breaking news ", lastUpdated: "23/11/25" },
    { id: "5", title: "Advertisement section on dashboard", lastUpdated: "23/11/25" },
    { id: "6", title: "Add new admin", lastUpdated: "23/11/25" },
];

export function CMSTable() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = useMemo(() => {
        if (!searchQuery) return initialData;
        const lowerQuery = searchQuery.toLowerCase();
        return initialData.filter((item) => item.title.toLowerCase().includes(lowerQuery));
    }, [searchQuery]);

    const { table } = useDataTable({
        data: filteredData,
        columns: cmsColumns,
        pageCount: 1,
    });

    return (
        <section className="py-5">
            <DataTable table={table} className="gap-2.5 lg:px-5">
                <div className="flex items-center justify-between px-4 lg:p-0">
                    <div className="relative w-full">
                        <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#7F7F7F]" />
                        <Input
                            placeholder="Search CMS"
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
