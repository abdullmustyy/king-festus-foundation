"use client";

import { type ColumnDef } from "@tanstack/react-table";

import CalendarClock from "@/components/ui/icons/calendar-clock";
import Department from "@/components/ui/icons/department";
import Host from "@/components/ui/icons/host";
import Status from "@/components/ui/icons/status";
import { cn } from "@/lib/utils";
import StatusTag from "../../dasboard/status-tag";

export type TMeetingsAndEvents = {
    id: string;
    date_time: string;
    department: string;
    host: string;
    status: "Confirmed" | "Pending";
};

export const meetingsAndEventsColumns: ColumnDef<TMeetingsAndEvents>[] = [
    {
        accessorKey: "date_time",
        header: () => (
            <div className="flex items-center gap-1.5 text-black/50">
                <CalendarClock className="size-5" />
                <span>Date and Time</span>
            </div>
        ),
        meta: {
            label: "Date and Time",
        },
    },
    {
        accessorKey: "department",
        header: () => (
            <div className="flex items-center gap-1.5 text-black/50">
                <Department className="size-5" />
                <span>Department</span>
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <Department className="size-5 text-primary" />
                <span>{row.original.department}</span>
            </div>
        ),
        meta: {
            label: "Department",
        },
    },
    {
        accessorKey: "host",
        header: () => (
            <div className="flex items-center gap-1.5 text-black/50">
                <Host className="size-5" />
                <span>Host</span>
            </div>
        ),
        meta: {
            label: "Host",
        },
    },
    {
        accessorKey: "status",
        header: () => (
            <div className="flex items-center gap-1.5 text-black/50">
                <Status className="size-5" />
                <span>Status</span>
            </div>
        ),
        cell: ({ row }) => {
            const isConfirmed = row.original.status === "Confirmed";
            return (
                <StatusTag
                    status={row.original.status}
                    className={cn(
                        isConfirmed
                            ? "*:data-[slot='indicator']:bg-[#10B981]"
                            : "*:data-[slot='indicator']:bg-[#FEBC2F]",
                    )}
                />
            );
        },
        meta: {
            label: "Status",
        },
    },
];
