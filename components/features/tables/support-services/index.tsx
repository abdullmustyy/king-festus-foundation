"use client";

import { DataTable } from "@/components/features/tables/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { columns, SupportService } from "./columns";

const data: SupportService[] = [
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
        columns,
        pageCount: 1,
    });

    return <DataTable table={table} />;
}
