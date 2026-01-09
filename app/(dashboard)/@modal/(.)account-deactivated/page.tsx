"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SignOutButton, useClerk } from "@clerk/nextjs";
import { Info, LogOut } from "lucide-react";

export default function AccountDeactivatedModal() {
    const { signOut } = useClerk();

    return (
        <Dialog
            defaultOpen={true}
            onOpenChange={() => {
                signOut({ redirectUrl: "/" });
            }}
        >
            <DialogContent className="sm:max-w-md [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="text-destructive">Account Deactivated</DialogTitle>
                    <DialogDescription>
                        Your account has been deactivated by an administrator. You will be signed out.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-center gap-1.5 py-4 text-muted-foreground">
                    <Info className="size-4" />
                    <p className="text-center text-sm">Please contact support if you believe this is a mistake.</p>
                </div>

                <div className="flex justify-center">
                    <SignOutButton redirectUrl="/">
                        <Button variant="destructive" className="w-full gap-2 text-sm">
                            <LogOut />
                            Sign Out Now
                        </Button>
                    </SignOutButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
