"use client";

import { cn } from "@/lib/utils";
import Logo from "@/public/images/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";
import DottedArrowRight from "../ui/icons/dotted-arrow-right";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Governance Structure", href: "/governance-structure" },
    { name: "Contacts Us", href: "/contact-us" },
];

const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="w-contain">
            <div className="py-6 flex items-center justify-center">
                <Image src={Logo} alt="King Festus Foundation" />
            </div>
            <div className="flex items-center justify-between py-5">
                <ul className="flex items-center gap-10">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <a
                                href={link.href}
                                title={link.name}
                                className={cn(
                                    "text-foreground/50 hover:text-foreground transition-colors duration-300 text-sm",
                                    {
                                        "text-primary": link.href === pathname,
                                    },
                                )}
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>

                <Link href="" title="Sign in" className={cn(buttonVariants())}>
                    Sign in
                    <DottedArrowRight className="size-4.5" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
