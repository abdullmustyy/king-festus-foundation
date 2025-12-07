import Home from "@/components/ui/icons/home";
import Image from "@/components/ui/icons/image";

export const sidebarLinks = {
    main: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
        },
        {
            title: "Media",
            url: "/dashboard/media",
            icon: Image,
        },
        {
            title: "CMS",
            url: "/dashboard/cms",
            icon: Image,
            roles: ["ADMIN"],
        },
    ],

    supportApps: [
        { title: "Microsoft Outlook", url: "" },
        { title: "Microsoft Excel", url: "" },
        { title: "Microsoft PowerPoint", url: "" },
        { title: "Microsoft Word", url: "" },
        { title: "Microsoft 365 Apps (Suite Page)", url: "" },
    ],
};
