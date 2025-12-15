import Home from "@/components/ui/icons/home";
import Image from "@/components/ui/icons/image";
import { Calendar, File, History, Mail } from "lucide-react";

export const sidebarLinks = {
    main: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
        },
        {
            title: "Photo dump",
            url: "/dashboard/media",
            icon: Image,
        },
        {
            title: "Calendar",
            url: "https://calendar.google.com/",
            icon: Calendar,
            target: "_blank",
        },
        {
            title: "Email",
            url: "https://mail.hostinger.com/",
            icon: Mail,
            target: "_blank",
        },
        {
            title: "Past announcements",
            url: "/dashboard/past-announcements",
            icon: History,
        },
        {
            title: "CMS",
            url: "/dashboard/cms",
            icon: File,
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
