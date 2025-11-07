"use client";

import { DataTable } from "@/components/features/tables/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { meetingsAndEventsColumns, TMeetingsAndEvents } from "./columns";

const data: TMeetingsAndEvents[] = [
    {
        id: "1",
        date_time: "28 Oct, 2:00 PM",
        department: "Medicare Consultation",
        host: "John Doe",
        status: "Confirmed",
    },
    {
        id: "2",
        date_time: "30 Oct, 10:00 AM",
        department: "Accounts Clarification",
        host: "Dr. Ada",
        status: "Pending",
    },
];

const MeetingsAndEventsTable = () => {
    const { table } = useDataTable({
        data,
        columns: meetingsAndEventsColumns,
        pageCount: 1,
    });

    return <DataTable table={table} />;
};

export default MeetingsAndEventsTable;
