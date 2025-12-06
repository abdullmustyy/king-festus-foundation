"use client";

import AboutUsForm from "@/components/features/forms/cms/about-us-form";
import AddAdminForm from "@/components/features/forms/cms/add-admin-form";
import BreakingNewsForm from "@/components/features/forms/cms/breaking-news-form";
import DashboardAdsForm from "@/components/features/forms/cms/dashboard-ads-form";
import GovernanceStructureForm from "@/components/features/forms/cms/governance-structure-form";
import LandingPageMediaForm from "@/components/features/forms/cms/landing-page-media-form";
import { DataTable } from "@/components/features/tables/data-table/data-table";
import { Button } from "@/components/ui/button";
import Search from "@/components/ui/icons/search";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AboutUs, BreakingNews, DashboardAd, GovernanceBody, LandingPage, MediaAsset } from "@/generated/prisma/client";
import { useDataTable } from "@/hooks/use-data-table";
import { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cmsColumns, TCMS } from "./columns";

const CMS_IDS = {
    LANDING_MEDIA: "landing-media",
    GOVERNANCE: "governance",
    ABOUT_US: "about-us",
    BREAKING_NEWS: "breaking-news",
    DASHBOARD_ADS: "dashboard-ads",
    ADD_ADMIN: "add-admin",
} as const;

interface ICMSTableProps {
    breakingNewsData?: BreakingNews | null;
    governanceBodiesData?: (GovernanceBody & { mediaAsset: MediaAsset | null })[] | null;
    dashboardAdData?: (DashboardAd & { mediaAsset: MediaAsset | null }) | null;
    landingPageData?: LandingPage | null;
    aboutUsData?: AboutUs | null;
    latestGovernanceUpdate?: Date;
}

export function CMSTable({
    breakingNewsData,
    governanceBodiesData,
    dashboardAdData,
    landingPageData,
    aboutUsData,
    latestGovernanceUpdate,
}: ICMSTableProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<TCMS | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);

    const dynamicInitialData: TCMS[] = useMemo(() => {
        const data: TCMS[] = [
            {
                id: CMS_IDS.LANDING_MEDIA,
                title: "Media on landing page",
                lastUpdated: landingPageData?.updatedAt ? format(landingPageData.updatedAt, "dd/MM/yy") : "--",
            },
            {
                id: CMS_IDS.GOVERNANCE,
                title: "Governance structure",
                lastUpdated:
                    latestGovernanceUpdate && latestGovernanceUpdate.getTime() > 0
                        ? format(latestGovernanceUpdate, "dd/MM/yy")
                        : "--",
            },
            {
                id: CMS_IDS.ABOUT_US,
                title: "About us",
                lastUpdated: aboutUsData?.updatedAt ? format(aboutUsData.updatedAt, "dd/MM/yy") : "--",
            },
            {
                id: CMS_IDS.BREAKING_NEWS,
                title: "Scroll bar with breaking news",
                lastUpdated: breakingNewsData?.updatedAt ? format(breakingNewsData.updatedAt, "dd/MM/yy") : "--",
            },
            {
                id: CMS_IDS.DASHBOARD_ADS,
                title: "Advertisement section on dashboard",
                lastUpdated: dashboardAdData?.updatedAt ? format(dashboardAdData.updatedAt, "dd/MM/yy") : "--",
            },
            { id: CMS_IDS.ADD_ADMIN, title: "Add new admin", lastUpdated: "--" },
        ];
        return data;
    }, [landingPageData, latestGovernanceUpdate, aboutUsData, breakingNewsData, dashboardAdData]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return dynamicInitialData;
        const lowerQuery = searchQuery.toLowerCase();
        return dynamicInitialData.filter((item) => item.title.toLowerCase().includes(lowerQuery));
    }, [searchQuery, dynamicInitialData]);

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

    const handleSubmittingChange = (isSubmitting: boolean) => {
        setIsPublishing(isSubmitting);
    };

    const handleComplete = () => {
        setIsSheetOpen(false);
        router.refresh();
    };

    const renderSheetContent = () => {
        if (!selectedRow) return null;

        switch (selectedRow.id) {
            case CMS_IDS.LANDING_MEDIA:
                return (
                    <LandingPageMediaForm
                        id={`${CMS_IDS.LANDING_MEDIA}-form`}
                        onComplete={handleComplete}
                        onSubmittingChange={handleSubmittingChange}
                    />
                );
            case CMS_IDS.GOVERNANCE:
                return (
                    <GovernanceStructureForm
                        id={`${CMS_IDS.GOVERNANCE}-form`}
                        onComplete={handleComplete}
                        onSubmittingChange={handleSubmittingChange}
                        initialData={{
                            governanceBodies: governanceBodiesData?.map((b) => ({
                                id: b.id,
                                image: b.mediaAsset?.url,
                                mediaAssetId: b.mediaAssetId,
                                name: b.name,
                                role: b.role,
                            })),
                        }}
                    />
                );
            case CMS_IDS.ABOUT_US:
                return (
                    <AboutUsForm
                        id={`${CMS_IDS.ABOUT_US}-form`}
                        onComplete={handleComplete}
                        onSubmittingChange={handleSubmittingChange}
                    />
                );
            case CMS_IDS.BREAKING_NEWS:
                return (
                    <BreakingNewsForm
                        id={`${CMS_IDS.BREAKING_NEWS}-form`}
                        onComplete={handleComplete}
                        onSubmittingChange={handleSubmittingChange}
                        initialData={breakingNewsData}
                    />
                );
            case CMS_IDS.DASHBOARD_ADS:
                return (
                    <DashboardAdsForm
                        id={`${CMS_IDS.DASHBOARD_ADS}-form`}
                        onComplete={handleComplete}
                        onSubmittingChange={handleSubmittingChange}
                        initialData={dashboardAdData}
                    />
                );
            case CMS_IDS.ADD_ADMIN:
                return <AddAdminForm id={`${CMS_IDS.ADD_ADMIN}-form`} onComplete={handleComplete} />;
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
                        setIsPublishing(false);
                    }
                }}
            >
                <SheetContent className="h-full gap-0 *:data-[slot='sheet-close']:hidden sm:max-w-xl">
                    <SheetHeader className="flex-row items-center justify-between space-y-0 border-b">
                        {selectedRow?.id === CMS_IDS.ADD_ADMIN ? (
                            <>
                                <SheetTitle className="font-normal">Add new admins</SheetTitle>
                                <SheetDescription className="sr-only">Add new admins</SheetDescription>
                                <SheetClose asChild>
                                    <Button variant="ghost" size="icon" className="size-9 rounded-full">
                                        <XIcon className="size-4" />
                                    </Button>
                                </SheetClose>
                            </>
                        ) : (
                            <>
                                <SheetTitle className="sr-only font-normal">{selectedRow?.title}</SheetTitle>
                                <SheetDescription className="sr-only">{selectedRow?.title}</SheetDescription>
                                <SheetClose asChild>
                                    <Button variant="ghost" size="icon" className="size-9 rounded-full">
                                        <XIcon className="size-4" />
                                    </Button>
                                </SheetClose>
                                <Button
                                    size="sm"
                                    type="submit"
                                    isLoading={isPublishing}
                                    form={selectedRow ? `${selectedRow.id}-form` : undefined}
                                    className="rounded-full text-sm"
                                >
                                    Publish
                                </Button>
                            </>
                        )}
                    </SheetHeader>

                    <div className="hide-scrollbar flex-1 overflow-y-auto">{renderSheetContent()}</div>
                </SheetContent>
            </Sheet>
        </section>
    );
}
