import Navbar from "@/components/layout/navbar";
import AuthVolunteerImage from "@/public/images/auth-volunteer-image.svg";
import Image from "next/image";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <>
            <Navbar className="w-contain gap-4 lg:pb-4 lg:*:data-[slot='navbar-menu']:justify-center *:data-[slot='navbar-menu']:justify-between" />

            <main className="bg-white lg:py10 py20 flex-1 flex items-center">
                <section className="w-contain grid lg:grid-cols-2 items-center xl:gap-30 gap-7">
                    {children}

                    <div className="lg:block hidden p-15">
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
