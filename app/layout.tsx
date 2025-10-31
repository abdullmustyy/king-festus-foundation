import { cn } from "@/lib/utils";
import type { Metadata } from "next";
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
        <html lang="en">
            <body className={cn(sfPro.variable, instrumentSans.variable, "min-h-dvh flex flex-col")}>{children}</body>
        </html>
    );
}
