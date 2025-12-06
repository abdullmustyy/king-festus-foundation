import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { instrumentSans, sfPro } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
    title: "King Festus Foundation",
    description:
        "King Festus Foundation was established in 2021 to support a network of related families towards achieving stable, middle-class livelihoods through facilitation of free medical and legal advisory services, affordable loans, vocational training, joint ventures, regulated savings groups as well as financial literacy education.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={cn(sfPro.variable, instrumentSans.variable, "flex min-h-dvh flex-col")}>
                    <NuqsAdapter>{children}</NuqsAdapter>
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    );
}
