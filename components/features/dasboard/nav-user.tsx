"use client";

import { IconCreditCard, IconLogout, IconNotification, IconUserCircle } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { sidebarLinks } from "@/lib/constants/dashboard";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import React from "react";

interface INavUserProps extends React.ComponentProps<typeof SidebarMenuItem> {
    user: typeof sidebarLinks.user;
}

export function NavUser({ className, user }: INavUserProps) {
    const { isMobile } = useSidebar();

    return (
        <SidebarMenuItem className={cn(className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="focus-visible:ring-0">
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <Avatar className="size-6 rounded-lg grayscale">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-lg text-xs">L</AvatarFallback>
                        </Avatar>
                        <span className="truncate font-medium text-sm">{user.name}</span>

                        <Ellipsis className="ml-auto size-3.75 text-[#71717A]" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>

                            <span className="truncate font-medium text-sm">{user.name}</span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <IconUserCircle />
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <IconCreditCard />
                            Billing
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <IconNotification />
                            Notifications
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <IconLogout />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}
