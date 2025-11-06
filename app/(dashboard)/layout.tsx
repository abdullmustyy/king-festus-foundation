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

            <main className="bg-white relative flex w-full flex-1 flex-col">
                <SiteHeader />

                {children}
            </main>
        </SidebarProvider>
    );
};

export default DashboardLayout;
