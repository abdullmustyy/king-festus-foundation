"use client";

import { useEffect, useState } from "react";

export const useCopyToClipboard = (timeout = 2000) => {
    const [isCopied, setIsCopied] = useState(false);

    const copy = async (text: string) => {
        if (!navigator.clipboard) {
            console.error("Clipboard API not available");
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
        } catch (err) {
            console.error("Failed to copy text: ", err);
            setIsCopied(false);
        }
    };

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, timeout);

            return () => clearTimeout(timer);
        }
    }, [isCopied, timeout]);

    return { isCopied, copy };
};