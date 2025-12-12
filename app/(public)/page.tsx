import { HeroCarousel } from "@/components/features/landing/hero-carousel";
import { buttonVariants } from "@/components/ui/button";
import DottedArrowRight from "@/components/ui/icons/dotted-arrow-right";
import SectionTag from "@/components/ui/section-tag";
import { baseSocialLinks, METADATA_DESCRIPTION, METADATA_IMAGE, METADATA_TITLE, METADATA_URL } from "@/lib/constants";
import db from "@/lib/db";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
    const landingPage = await db.landingPage.findFirst({
        include: { media: { include: { mediaAsset: true } } },
    });

    const pageTitle = `Empowering Progress Through Purpose`;
    const pageDescription = METADATA_DESCRIPTION;
    const imageUrl = landingPage?.media?.[0]?.mediaAsset?.url || "/images/hero-volunteer-image.svg";

    return {
        title: pageTitle,
        description: pageDescription,
        openGraph: {
            title: pageTitle,
            description: pageDescription,
            images: [imageUrl],
        },
        twitter: {
            title: pageTitle,
            description: pageDescription,
            images: [imageUrl],
        },
    };
}

const HomePage = async () => {
    const landingPage = await db.landingPage.findFirst({
        include: { media: { include: { mediaAsset: true } } },
    });

    const socialLinks = baseSocialLinks.map((link) => link.href);

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: METADATA_TITLE,
        url: METADATA_URL,
        logo: `${METADATA_URL}${METADATA_IMAGE}`,
        description: METADATA_DESCRIPTION,
        sameAs: socialLinks,
    };

    const landingPageMedia = landingPage?.media || [];

    return (
        <section className="w-contain grid items-center gap-7 py-10 lg:grid-cols-2 lg:grid-rows-[28.125rem]">
            {/* JSON-LD Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <div className="flex flex-col gap-8">
                <div className="space-y-2.5">
                    <SectionTag tag="INTRODUCING King Festus Foundation" className="uppercase" />
                    <div className="space-y-5">
                        <h1 className="text-5xl leading-[100%]">Empowering progress through purpose</h1>
                        <p className="text-xl text-foreground/50">
                            King Festus Foundation was established in 2021 to support a network of related families
                            towards achieving stable, middle-class standard of living through facilitation of free
                            medical and legal advisory services, affordable loans, vocational training, joint ventures,
                            regulated savings groups as well as financial literacy education.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-5">
                    <Link
                        href="/about-us"
                        title="See about the foundation"
                        className={cn(buttonVariants({ size: "lg" }), "w-full lg:w-fit")}
                    >
                        See about the foundation
                        <DottedArrowRight className="size-4.5" />
                    </Link>
                    <Link
                        href="/contact-us"
                        title="Reach out"
                        className={cn(
                            buttonVariants({ size: "lg" }),
                            "w-full bg-white text-foreground hover:bg-white/90 lg:w-fit",
                        )}
                    >
                        Reach out
                    </Link>
                </div>
            </div>

            <div className="relative size-full min-h-[300px] lg:min-h-auto">
                <HeroCarousel media={landingPageMedia} />
            </div>
        </section>
    );
};

export default HomePage;
