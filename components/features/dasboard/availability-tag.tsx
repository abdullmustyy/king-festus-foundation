import { cn } from "@/lib/utils";
import React from "react";

interface IAvailabilityTag extends React.ComponentProps<"div"> {
    status: React.ReactNode;
}

const AvailabilityTag = ({ className, status }: IAvailabilityTag) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div data-slot="indicator" className="inline-block size-2 rounded-xs" />
            <span>{status}</span>
        </div>
    );
};

export default AvailabilityTag;
