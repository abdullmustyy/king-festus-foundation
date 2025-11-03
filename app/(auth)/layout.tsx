import Navbar from "@/components/layout/navbar";
import AuthVolunteerImage from "@/public/images/auth-volunteer-image.svg";
import Image from "next/image";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <>
            <Navbar className="w-contain lg:pb-4 lg:*:data-[slot='navbar-menu']:justify-center *:data-[slot='navbar-menu']:justify-between" />

            <main className="bg-white lg:py-10 py-20 flex-1 flex items-center">
                <section className="w-contain flex justify-between xl:gap-46 gap-7">
                    {children}

                    <div className="lg:w-1/2 lg:block hidden">
                        <Image
                            src={AuthVolunteerImage}
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
