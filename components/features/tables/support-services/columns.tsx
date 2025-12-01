"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { buttonVariants } from "@/components/ui/button";
import Action from "@/components/ui/icons/action";
import Department from "@/components/ui/icons/department";
import Status from "@/components/ui/icons/status";
import Vendor from "@/components/ui/icons/vendor";
import { cn } from "@/lib/utils";
import Link from "next/link";
import StatusTag from "../../dashboard/status-tag";

export type TSupportServices = {
    id: string;
    department: string;
    vendor: "Available" | "Not Available";
    status: "Available" | "Not Available";
};

export const supportServicesColumns: ColumnDef<TSupportServices>[] = [
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
        accessorKey: "vendor",
        header: () => (
            <div className="flex items-center gap-1.5 text-black/50">
                <Vendor className="size-5" />
                <span>Vendor</span>
            </div>
        ),
        cell: ({ row }) => {
            const isAvailable = row.original.vendor === "Available";
            return (
                <StatusTag
                    status={
                        <span>
                            {row.original.vendor} {isAvailable && <span className="text-black/50">(Mon - Fri)</span>}
                        </span>
                    }
                    className={cn(
                        isAvailable
                            ? "*:data-[slot='indicator']:bg-[#10B981]"
                            : "*:data-[slot='indicator']:bg-[#FEBC2F]",
                    )}
                />
            );
        },
        meta: {
            label: "Vendor",
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
            const isAvailable = row.original.status === "Available";
            return (
                <StatusTag
                    status={
                        <span>
                            {row.original.status} {isAvailable && <span className="text-black/50">(Mon - Fri)</span>}
                        </span>
                    }
                    className={cn(
                        isAvailable
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
    {
        id: "actions",
        header: () => (
            <div className="flex items-center gap-1.5 text-black/50">
                <Action className="size-5" />
                <span>Action</span>
            </div>
        ),
        cell: ({ row }) => {
            const isAvailable = row.original.status === "Available";
            if (isAvailable) {
                const department = row.original.department;
                let scheduleMeetingHref = ""; // Default empty href
                const sendMailHref = ""; // Default empty href
                let firstLinkText = "Schedule meeting";

                if (department === "Accounts Clarification") {
                    scheduleMeetingHref = "https://books.zohosecure.com/portal/festusfoundation/index#/statement";
                    firstLinkText = "View account statement";
                }

                return (
                    <div className="flex items-center gap-2">
                        <Link
                            href={scheduleMeetingHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                buttonVariants({ size: "sm" }),
                                "rounded-full bg-primary/20 text-primary hover:bg-primary/10",
                            )}
                        >
                            {firstLinkText}
                        </Link>
                        <Link
                            href={sendMailHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                buttonVariants({ size: "sm" }),
                                "rounded-full bg-primary/20 text-primary hover:bg-primary/10",
                            )}
                        >
                            Send mail
                        </Link>
                    </div>
                );
            }
            return null;
        },
        meta: {
            label: "Action",
        },
    },
];
