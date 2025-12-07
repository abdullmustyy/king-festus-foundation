"use client";

import { cn } from "@/lib/utils";
import LogoIcon from "@/public/images/logo-icon.svg";
import Logo from "@/public/images/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useState } from "react";
import { Button } from "../ui/button";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Governance Structure", href: "/governance-structure" },
    { name: "Contact Us", href: "/contact-us" },
];

const Navbar = ({ children, className }: React.ComponentProps<"nav">) => {
    const pathname = usePathname();
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [prevPath, setPrevPath] = useState(pathname);

    const closeMenu = useCallback(() => {
        setIsHamburgerOpen(false);
    }, []);

    if (prevPath !== pathname) {
        closeMenu();
        setPrevPath(pathname);
    }

    return (
        <nav className={cn("relative flex-col lg:flex", className)}>
            <div className="hidden items-center justify-center lg:flex">
                <Link href="/" title="King Festus Foundation | Home">
                    <Image src={Logo} alt="King Festus Foundation" priority className="h20" />
                </Link>
            </div>

            <div data-slot="navbar-menu" className="flex items-center justify-between">
                <Link href="/" title="King Festus Foundation | Home" className="block lg:hidden">
                    <Image src={LogoIcon} alt="King Festus Foundation" priority className="size-25" />
                </Link>

                <ul className="hidden items-center gap-10 lg:flex">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <a
                                href={link.href}
                                title={link.name}
                                className={cn(
                                    "text-sm text-foreground/50 transition-colors duration-300 hover:text-foreground",
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

                <div className="flex items-center gap-2">
                    {children}

                    <Button
                        aria-label={isHamburgerOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isHamburgerOpen ? "true" : "false"}
                        variant="ghost"
                        className="inline-flex size-10 md:hidden"
                        onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
                    >
                        <div className="flex items-center [--bar-width:calc(var(--spacing)*6)] *:transition-all *:duration-300">
                            {/* Top bar */}
                            <div
                                className={cn("h-0.5 w-(--bar-width) translate-x-full bg-primary", {
                                    "-translate-y-2": !isHamburgerOpen,
                                })}
                            />
                            {/* Middle bar */}
                            <div className={cn("h-0.5 w-(--bar-width) bg-primary")} />
                            {/* Bottom bar */}
                            <div
                                className={cn("h-0.5 w-(--bar-width) -translate-x-full bg-primary", {
                                    "translate-y-2": !isHamburgerOpen,
                                })}
                            />
                        </div>
                    </Button>
                </div>
            </div>

            {/* Mobile Nav */}
            <div
                className={cn(
                    "absolute inset-x-0 z-10 bg-background transition-all duration-300 lg:hidden",
                    isHamburgerOpen
                        ? "max-h-dvh py-6 [clip-path:inset(0_0_0_0)]"
                        : "max-h-0 py-0 [clip-path:inset(0_0_100%_0)]",
                )}
            >
                <ul className="flex flex-col items-center gap-4">
                    {navLinks.map((item, index) => (
                        <li key={item.name + index} className="group relative">
                            <Link
                                href={item.href}
                                className={cn("transition-all duration-300 hover:text-primary", {
                                    "text-primary": pathname === item.href,
                                })}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
