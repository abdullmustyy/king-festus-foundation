"use client";

import { DataTable } from "@/components/features/tables/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableViewOptions } from "../data-table/data-table-view-options";
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

    return (
        <section className="p-5">
            <DataTable table={table} className="gap-5">
                <div className="flex items-center justify-between">
                    <h6 className="font-medium">Upcoming Meetings and Events</h6>
                    <DataTableViewOptions table={table} align="end" />
                </div>
            </DataTable>
        </section>
    );
};

export default MeetingsAndEventsTable;
