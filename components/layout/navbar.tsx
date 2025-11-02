"use client";

import { cn } from "@/lib/utils";
import Logo from "@/public/images/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Governance Structure", href: "/governance-structure" },
    { name: "Contacts Us", href: "/contact-us" },
];

const Navbar = ({ children, className }: React.ComponentProps<"nav">) => {
    const pathname = usePathname();

    return (
        <nav className={cn("w-contain", className)}>
            <div className="py-6 flex items-center justify-center">
                <Link href="/" title="King Festus Foundation | Home">
                    <Image src={Logo} alt="King Festus Foundation" priority />
                </Link>
            </div>

            <div data-slot="navbar-menu" className="flex items-center py-5">
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

                {children}
            </div>
        </nav>
    );
};

export default Navbar;
