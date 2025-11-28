"use client";

import CalendarWeek from "@/components/ui/icons/calendar-week";
import File from "@/components/ui/icons/file";
import { ColumnDef } from "@tanstack/react-table";

export type TCMS = {
    id: string;
    title: string;
    lastUpdated: string;
};

export const cmsColumns: ColumnDef<TCMS>[] = [
    {
        accessorKey: "title",
        header: () => (
            <div className="flex items-center gap-1.5 text-[#7F7F7F]">
                <File className="size-5" />
                <span>Title</span>
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <File className="size-5 text-[#4D4D4D]" />
                <span>{row.original.title}</span>
            </div>
        ),
        meta: {
            label: "Title",
        },
    },
    {
        accessorKey: "lastUpdated",
        header: () => (
            <div className="flex items-center gap-1.5 text-[#7F7F7F]">
                <CalendarWeek className="size-5" />
                <span>Last updated</span>
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <span>{row.original.lastUpdated}</span>
            </div>
        ),
        meta: {
            label: "Last updated",
        },
    },
];
