"use client";

import { NavUser } from "@/components/features/dasboard/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarLinks } from "@/lib/constants/dashboard";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            {sidebarLinks.main.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton tooltip={item.title} asChild>
                                        <Link href={item.url}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
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
                    <NavUser user={sidebarLinks.user} className="border-t py-3 border-dashed" />
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
