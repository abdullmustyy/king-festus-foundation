// import MeetingsAndEventsTable from "@/components/features/tables/meetings-and-events";
import { AdsCarousel } from "@/components/features/dashboard/ads-carousel";
import { SupportServicesTable } from "@/components/features/tables/support-services";
import db from "@/lib/db";
import DashboardVolunteerImage from "@/public/images/dashboard-volunteer-image.svg";
import Image from "next/image";
import { Suspense } from "react";

const DashboardPage = async () => {
    const dashboardAds = await db.dashboardAd.findMany({
        where: { status: true },
        include: { mediaAsset: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <>
            {/* Support Services */}
            <Suspense fallback={<></>}>
                <SupportServicesTable />
            </Suspense>

            {/* Dashboard Ad */}
            <section className="px-4 pb-5 lg:px-5">
                {dashboardAds.length > 0 ? (
                    <AdsCarousel ads={dashboardAds} />
                ) : (
                    <div className="h-65.5 overflow-hidden rounded-[20px]">
                        <Image
                            src={DashboardVolunteerImage}
                            alt=""
                            className="size-full object-cover"
                            width={600}
                            height={262}
                        />
                    </div>
                )}
            </section>

            {/* Upcoming Meetings and Events. */}
            {/* <Suspense fallback={<></>}>
                <MeetingsAndEventsTable />
            </Suspense> */}
        </>
    );
};

export default DashboardPage;
