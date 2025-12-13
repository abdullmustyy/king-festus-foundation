"use client";

import { Button } from "@/components/ui/button";
import Copy from "@/components/ui/icons/copy";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Check } from "lucide-react";
import Link from "next/link";

export const ContactItem = ({
    href,
    title,
    icon,
    label,
    value,
}: {
    href?: string;
    title: string;
    icon?: React.ReactNode;
    label: string | null;
    value: string;
}) => {
    const { isCopied, copy } = useCopyToClipboard();

    const content = (
        <div className="flex items-center gap-1.5 *:[svg]:shrink-0">
            {icon}
            <span>{label}</span>
        </div>
    );

    return (
        <div className="flex items-center justify-between">
            {href ? (
                <Link href={href} title={title} target="_blank" rel="noopener noreferrer">
                    {content}
                </Link>
            ) : (
                <div title={title}>{content}</div>
            )}
            <Button variant="ghost" size="icon" onClick={() => copy(value)}>
                {isCopied ? <Check className="size-5 opacity-20" /> : <Copy className="size-5 opacity-20" />}
            </Button>
        </div>
    );
};
