import { SidebarTrigger } from "@/components/ui/sidebar";
import LogoIcon from "@/public/images/logo-icon.svg";
import Image from "next/image";
import Link from "next/link";

const SiteHeader = () => {
    return (
        <header className="flex shrink-0 items-center gap-2 px-5 py-2 border-b border-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="w-full flex items-center">
                <Link href="/dashboard" className="mx-auto">
                    <div className="flex flex-col items-center gap-1">
                        <Image src={LogoIcon} alt="King Festus Foundation" priority className="size-15.5" />
                        <span className="text-sm font-medium uppercase">King Festus Foundation</span>
                    </div>
                </Link>
                
                <SidebarTrigger className="lg:hidden" />
            </div>
        </header>
    );
};

export default SiteHeader;
