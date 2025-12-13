import { HeroCarousel } from "@/components/features/landing/hero-carousel";
import Navbar from "@/components/layout/navbar";
import db from "@/lib/db";

const AuthLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const landingPage = await db.landingPage.findFirst({
        include: { media: { include: { mediaAsset: true } } },
    });
    const landingPageMedia = landingPage?.media || [];

    return (
        <>
            <Navbar className="w-contain gap-4 *:data-[slot='navbar-menu']:justify-between lg:pb-4 lg:*:data-[slot='navbar-menu']:justify-center" />

            <main className="lg:py10 py20 flex flex-1 items-center bg-white">
                <section className="w-contain grid items-center gap-7 lg:grid-cols-2 xl:gap-30">
                    {children}

                    <div className="hidden size-full p-15 lg:block">
                        <HeroCarousel media={landingPageMedia} />
                    </div>
                </section>
            </main>
        </>
    );
};

export default AuthLayout;
