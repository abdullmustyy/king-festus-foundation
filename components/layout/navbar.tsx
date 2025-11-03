"use client";

import { cn } from "@/lib/utils";
import LogoMobile from "@/public/images/logo-mobile.svg";
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
    { name: "Contacts Us", href: "/contact-us" },
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
        <nav className={cn("relative", className)}>
            <div className="lg:flex hidden items-center justify-center">
                <Link href="/" title="King Festus Foundation | Home">
                    <Image src={Logo} alt="King Festus Foundation" priority className="h-20" />
                </Link>
            </div>

            <div data-slot="navbar-menu" className="flex items-center justify-between">
                <Link href="/" title="King Festus Foundation | Home" className="lg:hidden block">
                    <Image src={LogoMobile} alt="King Festus Foundation" priority className="size-25" />
                </Link>

                <ul className="lg:flex hidden items-center gap-10">
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

                <div className="flex items-center gap-2">
                    {children}

                    <Button
                        aria-label={isHamburgerOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isHamburgerOpen ? "true" : "false"}
                        variant="ghost"
                        className="md:hidden inline-flex size-10"
                        onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
                    >
                        <div className="flex items-center *:transition-all *:duration-300 [--bar-width:calc(var(--spacing)*6)]">
                            {/* Top bar */}
                            <div
                                className={cn("h-0.5 bg-primary w-(--bar-width) translate-x-full", {
                                    "-translate-y-2": !isHamburgerOpen,
                                })}
                            />
                            {/* Middle bar */}
                            <div className={cn("h-0.5 bg-primary w-(--bar-width)")} />
                            {/* Bottom bar */}
                            <div
                                className={cn("h-0.5 bg-primary w-(--bar-width) -translate-x-full", {
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
                    "lg:hidden absolute inset-x-0 z-10 bg-background transition-all duration-300",
                    isHamburgerOpen
                        ? "[clip-path:inset(0_0_0_0)] max-h-dvh py-6"
                        : "[clip-path:inset(0_0_100%_0)] max-h-0 py-0",
                )}
            >
                <ul className="flex flex-col items-center gap-4">
                    {navLinks.map((item, index) => (
                        <li key={item.name + index} className="group relative">
                            <Link
                                href={item.href}
                                className={cn("hover:text-primary transition-all duration-300", {
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
