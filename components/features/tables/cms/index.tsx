"use client";

import { DataTable } from "@/components/features/tables/data-table/data-table";
import { Button } from "@/components/ui/button";
import Search from "@/components/ui/icons/search";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { useDataTable } from "@/hooks/use-data-table";
import { Row } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import LandingPageMediaForm from "../../forms/cms/landing-page-media-form";
import { cmsColumns, TCMS } from "./columns";

const CMS_IDS = {
    LANDING_MEDIA: "landing-media",
    GOVERNANCE: "governance",
    ABOUT_US: "about-us",
    BREAKING_NEWS: "breaking-news",
    DASHBOARD_ADS: "dashboard-ads",
    ADD_ADMIN: "add-admin",
} as const;

const initialData: TCMS[] = [
    { id: CMS_IDS.LANDING_MEDIA, title: "Media on landing page", lastUpdated: "23/11/25" },
    { id: CMS_IDS.GOVERNANCE, title: "Governance structure", lastUpdated: "23/11/25" },
    { id: CMS_IDS.ABOUT_US, title: "About us", lastUpdated: "23/11/25" },
    { id: CMS_IDS.BREAKING_NEWS, title: "Scroll bar with breaking news ", lastUpdated: "23/11/25" },
    { id: CMS_IDS.DASHBOARD_ADS, title: "Advertisement section on dashboard", lastUpdated: "23/11/25" },
    { id: CMS_IDS.ADD_ADMIN, title: "Add new admin", lastUpdated: "23/11/25" },
];

export function CMSTable() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<TCMS | null>(null);

    const filteredData = useMemo(() => {
        if (!searchQuery) return initialData;
        const lowerQuery = searchQuery.toLowerCase();
        return initialData.filter((item) => item.title.toLowerCase().includes(lowerQuery));
    }, [searchQuery]);

    const { table } = useDataTable({
        data: filteredData,
        columns: cmsColumns,
        pageCount: 1,
        getRowId: (row) => row.id,
    });

    const handleRowClick = (row: Row<TCMS>) => {
        setSelectedRow(row.original);
        setIsSheetOpen(true);
    };

    const renderSheetContent = () => {
        if (!selectedRow) return null;

        switch (selectedRow.id) {
            case CMS_IDS.LANDING_MEDIA:
                return (
                    <LandingPageMediaForm
                        id={`${CMS_IDS.LANDING_MEDIA}-form`}
                        onUploadComplete={() => setIsSheetOpen(false)}
                    />
                );
            default:
                return <div className="mt-4 font-medium">{selectedRow.title}</div>;
        }
    };

    return (
        <section className="py-5">
            <DataTable
                table={table}
                onRowClick={handleRowClick}
                selectedRowId={selectedRow?.id}
                className="gap-2.5 lg:px-5"
            >
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

            <Sheet
                open={isSheetOpen}
                onOpenChange={(open) => {
                    setIsSheetOpen(open);
                    if (!open) {
                        setSelectedRow(null);
                    }
                }}
            >
                <SheetContent className="*:data-[slot='sheet-close']:hidden sm:max-w-xl">
                    <SheetHeader className="flex-row items-center justify-between space-y-0 border-b">
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon" className="size-9 rounded-full">
                                <XIcon className="size-4" />
                            </Button>
                        </SheetClose>
                        <Button
                            size="sm"
                            className="rounded-full text-sm"
                            type="submit"
                            form={selectedRow ? `${selectedRow.id}-form` : undefined}
                        >
                            Publish
                        </Button>
                    </SheetHeader>

                    {renderSheetContent()}
                </SheetContent>
            </Sheet>
        </section>
    );
}
