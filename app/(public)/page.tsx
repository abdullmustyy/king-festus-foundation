import { buttonVariants } from "@/components/ui/button";
import DottedArrowRight from "@/components/ui/icons/dotted-arrow-right";
import SectionTag from "@/components/ui/section-tag";
import db from "@/lib/db";
import { cn } from "@/lib/utils";
import HeroVolunteerImage from "@/public/images/hero-volunteer-image.svg";
import Image from "next/image";
import Link from "next/link";

const HomePage = async () => {
    const landingPage = await db.landingPage.findFirst({
        include: { heroMediaAsset: true },
    });

    return (
        <section className="w-contain grid items-center gap-7 py-10 lg:grid-cols-2 lg:grid-rows-[28.125rem]">
            <div className="flex flex-col gap-8">
                <div className="space-y-2.5">
                    <SectionTag tag="INTRODUCING King Festus Foundation" className="uppercase" />
                    <div className="space-y-5">
                        <h1 className="text-5xl leading-[100%]">Empowering progress through purpose</h1>
                        <p className="text-xl text-foreground/50">
                            King Festus Foundation was established in 2021 to support a network of related families
                            towards achieving stable, middle-class livelihoods through facilitation of free medical and
                            legal advisory services, affordable loans, vocational training, joint ventures, regulated
                            savings groups as well as financial literacy education.
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
                <Image
                    src={landingPage?.heroMediaAsset?.url || HeroVolunteerImage}
                    alt="Hero Volunteer Image"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    fill
                    priority
                    className="object-contain"
                />
            </div>
        </section>
    );
};

export default HomePage;
