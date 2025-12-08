import AdsMarquee from "@/components/features/dashboard/ads-marquee";
import { AppSidebar } from "@/components/layout/dashboard/app-sidebar";
import SiteHeader from "@/components/layout/dashboard/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const DashboardLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const user = await currentUser();
    let userRole = "USER";

    if (user) {
        const dbUser = await db.user.findUnique({
            where: { id: user.id },
            select: { role: true },
        });

        if (dbUser) {
            userRole = dbUser.role;
        }
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                } as React.CSSProperties
            }
        >
            <AppSidebar userRole={userRole} />

            <main className="relative flex w-full flex-1 flex-col pb-13.5">
                <SiteHeader />

                {children}

                <AdsMarquee className="fixed bottom-0" />
            </main>
        </SidebarProvider>
    );
};

export default DashboardLayout;
