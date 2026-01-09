"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { IconLogout } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export function NavUser({ className }: React.ComponentProps<typeof SidebarMenuItem>) {
    const { isMobile } = useSidebar();
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    if (!user) return null;

    return (
        <SidebarMenuItem className={cn(className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="focus-visible:ring-0">
                    <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                        <Avatar className="size-6 rounded-lg grayscale">
                            <AvatarImage src={user.imageUrl} alt={user.fullName ?? ""} />
                            <AvatarFallback className="rounded-lg text-xs">{user.fullName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="truncate text-sm font-medium">{user.fullName}</span>

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
                                <AvatarImage src={user.imageUrl} alt={user.fullName ?? ""} />
                                <AvatarFallback className="rounded-lg">{user.fullName?.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                                <span className="truncate text-sm font-medium">{user.fullName}</span>
                                <span className="text-xs text-muted-foreground">
                                    {user.emailAddresses[0].emailAddress}
                                </span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut(() => router.push("/auth/sign-in"))}>
                        <IconLogout />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}
