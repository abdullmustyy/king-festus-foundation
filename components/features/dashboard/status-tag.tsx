import { cn } from "@/lib/utils";
import React from "react";

interface IStatusTag extends React.ComponentProps<"div"> {
    status: React.ReactNode;
}

const StatusTag = ({ className, status }: IStatusTag) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div data-slot="indicator" className="inline-block size-2 rounded-xs" />
            <span>{status}</span>
        </div>
    );
};

export default StatusTag;
