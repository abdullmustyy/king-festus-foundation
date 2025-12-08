import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { instrumentSans, sfPro } from "./fonts";
import "./globals.css";

const title = "King Festus Foundation";
const description =
    "King Festus Foundation was established in 2021 to support a network of related families towards achieving stable, middle-class livelihoods through facilitation of free medical and legal advisory services, affordable loans, vocational training, joint ventures, regulated savings groups as well as financial literacy education.";
const url = "https://www.kingfestusfoundation.com/";
const image = "/images/logo-icon.svg";

export const metadata: Metadata = {
    metadataBase: new URL(url),
    title: {
        default: title,
        template: `%s | ${title}`,
    },
    description,
    openGraph: {
        title,
        description,
        url,
        siteName: title,
        images: [
            {
                url: image,
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
    },
    icons: {
        icon: image,
    },
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
