import Navbar from "@/components/layout/navbar";
import KingFestusFamily from "@/public/images/king-festus-family.webp";
import Image from "next/image";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <>
            <Navbar className="w-contain gap-4 *:data-[slot='navbar-menu']:justify-between lg:pb-4 lg:*:data-[slot='navbar-menu']:justify-center" />

            <main className="lg:py10 py20 flex flex-1 items-center bg-white">
                <section className="w-contain grid items-center gap-7 lg:grid-cols-2 xl:gap-30">
                    {children}

                    <div className="hidden p-15 lg:block">
                        <Image
                            src={KingFestusFamily}
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
