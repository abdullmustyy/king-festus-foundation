import AdsMarquee from "@/components/features/dasboard/ads-marquee";
import { AppSidebar } from "@/components/layout/dashboard/app-sidebar";
import SiteHeader from "@/components/layout/dashboard/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";

const DashboardLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                } as React.CSSProperties
            }
        >
            <AppSidebar />

            <main className="bg-white relative flex w-full flex-1 flex-col pb-13.5 overflow-hidden">
                <SiteHeader />

                {children}

                <AdsMarquee className="fixed bottom-0" />
            </main>
        </SidebarProvider>
    );
};

export default DashboardLayout;
