"use client";

import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function AccountDeactivatedPage() {
    return (
        <div className="flex min-h-[80vh] w-full flex-col items-center justify-center p-4 text-center">
            <h1 className="text-3xl font-medium text-destructive">Account Deactivated</h1>
            <p className="mt-2 max-w-md text-muted-foreground">
                Your account has been deactivated by an administrator. You no longer have access to the dashboard.
            </p>

            <div className="mt-8">
                <SignOutButton redirectUrl="/">
                    <Button variant="destructive" className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Sign Out Now
                    </Button>
                </SignOutButton>
            </div>
        </div>
    );
}
