import Navbar from "@/components/layout/navbar";
import HeroVolunteerImage from "@/public/images/hero-volunteer-image.svg";
import Image from "next/image";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <>
            <Navbar className="lg:*:data-[slot='navbar-menu']:justify-center *:data-[slot='navbar-menu']:justify-between" />

            <main className="bg-white py-20 flex-1 flex items-center">
                <section className="w-contain flex items-center justify-between xl:gap-46 gap-7">
                    {children}

                    <div className="lg:w-1/2 shrink-0 lg:block hidden">
                        <Image
                            src={HeroVolunteerImage}
                            alt="Hero Volunteer Image"
                            priority
                            className="size-full object-cover"
                        />
                    </div>
                </section>
            </main>
        </>
    );
};

export default AuthLayout;
