"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DeactivationChecker() {
    const router = useRouter();

    useEffect(() => {
        // Soft navigation to trigger intercepting route
        router.push("/account-deactivated");
    }, [router]);

    // Render nothing or a fallback while redirecting
    return null;
}
