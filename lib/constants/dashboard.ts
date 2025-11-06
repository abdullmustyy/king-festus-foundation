import Gear from "@/components/ui/icons/gear";
import Home from "@/components/ui/icons/home";
import Image from "@/components/ui/icons/image";

export const sidebarLinks = {
    user: {
        name: "Prima Abiola",
        avatar: "/avatars/shadcn.jpg",
    },
    main: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
        },
        {
            title: "Media",
            url: "/media",
            icon: Image,
        },
    ],
    footer: [
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Gear,
        },
    ],
};
