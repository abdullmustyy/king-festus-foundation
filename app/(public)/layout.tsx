import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { buttonVariants } from "@/components/ui/button";
import DottedArrowRight from "@/components/ui/icons/dotted-arrow-right";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar className="w-contain *:data-[slot='navbar-menu']:justify-between">
                <SignedIn>
                    <Link href="/dashboard" title="Dashboard" className={cn(buttonVariants())}>
                        Dashboard
                        <DottedArrowRight className="size-4.5" />
                    </Link>
                </SignedIn>
                <SignedOut>
                    <Link href="/auth/sign-in" title="Sign in" className={cn(buttonVariants())}>
                        Sign in
                        <DottedArrowRight className="size-4.5" />
                    </Link>
                </SignedOut>
            </Navbar>
            <main className="my-auto">{children}</main>
            <Footer />
        </>
    );
}
