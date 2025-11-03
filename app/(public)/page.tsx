import { buttonVariants } from "@/components/ui/button";
import DottedArrowRight from "@/components/ui/icons/dotted-arrow-right";
import SectionTag from "@/components/ui/section-tag";
import { cn } from "@/lib/utils";
import HeroVolunteerImage from "@/public/images/hero-volunteer-image.svg";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
    return (
        <section className="w-contain lg:py-5 py-10 grid lg:grid-cols-2 items-center gap-7">
            <div className="flex flex-col gap-12.5">
                <div className="space-y-2.5">
                    <SectionTag tag="INTRODUCING King Festus Foundation" className="uppercase" />
                    <div className="space-y-5">
                        <h1 className="lg:text-[4rem] text-5xl leading-[100%]">Empowering progress through purpose</h1>
                        <p className="text-xl text-foreground/50">
                            King Festus Foundation was established in 2021 to support a network of related families
                            towards achieving stable, middle-class livelihoods through facilitation of free medical and
                            legal advisory services, affordable loans, vocational training, joint ventures, regulated
                            savings groups as well as financial literacy education.
                        </p>
                    </div>
                </div>

                <div className="flex lg:flex-row flex-col items-center lg:gap-5 gap-4">
                    <Link
                        href=""
                        title="See about the foundation"
                        className={cn(buttonVariants({ size: "lg" }), "lg:w-fit w-full")}
                    >
                        See about the foundation
                        <DottedArrowRight className="size-4.5" />
                    </Link>
                    <Link
                        href=""
                        title="Reach out"
                        className={cn(
                            buttonVariants({ size: "lg" }),
                            "lg:w-fit w-full bg-white hover:bg-white/90 text-foreground",
                        )}
                    >
                        Reach out
                    </Link>
                </div>
            </div>

            <div>
                <Image
                    src={HeroVolunteerImage}
                    alt="Hero Volunteer Image"
                    priority
                    className="size-full object-cover"
                />
            </div>
        </section>
    );
};

export default HomePage;
