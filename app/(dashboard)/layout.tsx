import AdsMarquee from "@/components/features/dashboard/ads-marquee";
import { AppSidebar } from "@/components/layout/dashboard/app-sidebar";
import SiteHeader from "@/components/layout/dashboard/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import DeactivationChecker from "./_components/deactivation-checker";

const DashboardLayout = async ({
    children,
    modal,
}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) => {
    const user = await currentUser();
    let userRole = "USER";
    let shouldDeactivate = false;

    if (user) {
        const dbUser = await db.user.findUnique({
            where: { id: user.id },
            select: { role: true, isActive: true },
        });

        if (dbUser) {
            userRole = dbUser.role;
            if (!dbUser.isActive) {
                shouldDeactivate = true;
            }
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
            {shouldDeactivate && <DeactivationChecker />}
            <AppSidebar userRole={userRole} />

            <main className="relative flex w-full flex-1 flex-col pb-13.5">
                <SiteHeader />

                {children}
                {modal}

                <AdsMarquee className="fixed bottom-0" />
            </main>
        </SidebarProvider>
    );
};

export default DashboardLayout;
