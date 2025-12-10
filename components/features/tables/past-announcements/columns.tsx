"use client";

import CalendarWeek from "@/components/ui/icons/calendar-week";
import Status from "@/components/ui/icons/status";
import { BreakingNews } from "@/generated/prisma/client";
import { IconAd } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export const pastAnnouncementsColumns: ColumnDef<BreakingNews>[] = [
    {
        accessorKey: "headline",
        header: () => (
            <div className="flex items-center gap-1.5 text-[#7F7F7F]">
                <IconAd className="size-5" />
                <span>Headline</span>
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <IconAd className="size-5 text-[#4D4D4D]" />
                <span className="max-w-[200px] truncate" title={row.original.headline}>
                    {row.original.headline}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "linkUrl",
        header: () => (
            <div className="flex items-center gap-1.5 text-[#7F7F7F]">
                <LinkIcon className="size-5" />
                <span>Link URL</span>
            </div>
        ),
        cell: ({ row }) => {
            const url = row.original.linkUrl;
            if (!url) return <span className="text-muted-foreground">-</span>;
            return (
                <Link
                    href={url}
                    title={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:underline"
                >
                    <span className="max-w-50 truncate">{url}</span>
                    <ExternalLink className="size-3" />
                </Link>
            );
        },
    },
    {
        accessorKey: "startDate",
        header: () => (
            <div className="flex items-center gap-1.5 text-[#7F7F7F]">
                <CalendarWeek className="size-5" />
                <span>Start Date</span>
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <span>{format(new Date(row.original.startDate), "dd/MM/yy")}</span>
            </div>
        ),
    },
    {
        accessorKey: "endDate",
        header: () => (
            <div className="flex items-center gap-1.5 text-[#7F7F7F]">
                <CalendarWeek className="size-5" />
                <span>End Date</span>
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5">
                <span>{format(new Date(row.original.endDate), "dd/MM/yy")}</span>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: () => (
            <div className="flex items-center gap-1.5 text-[#7F7F7F]">
                <Status className="size-5" />
                <span>Status</span>
            </div>
        ),
        cell: ({ row }) => (
            <span className={row.original.status ? "text-[#10B981]" : "text-destructive"}>
                {row.original.status ? "Active" : "Inactive"}
            </span>
        ),
    },
];
