"use client";

import { NavUser } from "@/components/features/dashboard/nav-user";
import ArrowUpRight from "@/components/ui/icons/arrow-up-right";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { sidebarLinks } from "@/lib/constants/dashboard";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AppSidebar({ userRole, ...props }: React.ComponentProps<typeof Sidebar> & { userRole: string }) {
    const { isMobile, setOpenMobile } = useSidebar();
    const pathname = usePathname();

    const filteredMainLinks = sidebarLinks.main.filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(userRole || "");
    });

    useEffect(() => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }, [pathname, isMobile, setOpenMobile]);

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarContent className="gap-7.5 p-5">
                {/* Main group */}
                <SidebarGroup>
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            {filteredMainLinks.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        asChild
                                        className={cn({
                                            "bg-sidebar-accent": pathname === item.url,
                                        })}
                                    >
                                        <Link
                                            href={item.url}
                                            target={item.target}
                                            rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                                        >
                                            {item.icon && <item.icon />}

                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Support apps group */}
                <SidebarGroup>
                    <SidebarGroupContent className="flex flex-col gap-2.5">
                        <SidebarGroupLabel className="h-auto">Support apps</SidebarGroupLabel>
                        <SidebarMenu>
                            {sidebarLinks.supportApps.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        className="hover:bgtransparent h-auto justify-between"
                                        asChild
                                    >
                                        <Link href={item.url} target="_blank" rel="noopener noreferrer">
                                            <span>{item.title}</span>
                                            <ArrowUpRight className="size-4" />
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <NavUser className="border-t border-dashed py-3" />
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
