import { Toaster } from "@/components/ui/sonner";
import { METADATA_DESCRIPTION, METADATA_IMAGE, METADATA_TITLE, METADATA_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { instrumentSans, sfPro } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(METADATA_URL),
    title: {
        default: METADATA_TITLE,
        template: `%s | ${METADATA_TITLE}`,
    },
    description: METADATA_DESCRIPTION,
    openGraph: {
        title: METADATA_TITLE,
        description: METADATA_DESCRIPTION,
        url: METADATA_URL,
        siteName: METADATA_TITLE,
        images: [
            {
                url: METADATA_IMAGE,
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: METADATA_TITLE,
        description: METADATA_DESCRIPTION,
        images: [METADATA_IMAGE],
    },
    icons: {
        icon: METADATA_IMAGE,
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
                    {children}
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    );
}
