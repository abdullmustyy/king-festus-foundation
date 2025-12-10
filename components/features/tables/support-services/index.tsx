"use client";

import { DataTable } from "@/components/features/tables/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableViewOptions } from "../data-table/data-table-view-options";
import { supportServicesColumns, TSupportServices } from "./columns";

const data: TSupportServices[] = [
    {
        id: "1",
        department: "Medicare Consultation",
        vendor: "Available",
        status: "Available",
    },
    {
        id: "2",
        department: "Legal Consultation",
        vendor: "Available",
        status: "Available",
    },
    {
        id: "3",
        department: "Secretariat Support Services",
        vendor: "Available",
        status: "Available",
    },
    {
        id: "4",
        department: "Accounts Clarification",
        vendor: "Available",
        status: "Available",
    },
    {
        id: "5",
        department: "Personal Account / Ledger Review",
        vendor: "Available",
        status: "Available",
    },
    {
        id: "6",
        department: "IT Support",
        vendor: "Not Available",
        status: "Not Available",
    },
];

export function SupportServicesTable() {
    const { table } = useDataTable({
        data,
        columns: supportServicesColumns,
        pageCount: 1,
    });

    return (
        <section className="py-2">
            <DataTable table={table} className="gap-2 lg:px-5">
                <div className="flex items-center justify-between px-4 lg:p-0">
                    <h6 className="font-medium">Support Services</h6>
                    <DataTableViewOptions table={table} align="end" />
                </div>
            </DataTable>
        </section>
    );
}
