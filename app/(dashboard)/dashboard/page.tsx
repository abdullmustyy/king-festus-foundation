import MeetingsAndEventsTable from "@/components/features/tables/meetings-and-events";
import { SupportServicesTable } from "@/components/features/tables/support-services";
import db from "@/lib/db";
import DashboardVolunteerImage from "@/public/images/dashboard-volunteer-image.svg";
import Image from "next/image";
import { Suspense } from "react";
import ReactPlayer from "react-player";

const DashboardPage = async () => {
    const dashboardAd = await db.dashboardAd.findFirst({
        where: { status: true },
        include: { mediaAsset: true },
        orderBy: { createdAt: "desc" }, // Get the latest ad
    });

    const adMediaUrl = dashboardAd?.mediaAsset?.url || DashboardVolunteerImage;
    const isVideo = dashboardAd?.mediaAsset?.type === "VIDEO";

    return (
        <>
            {/* Support Services */}
            <Suspense fallback={<></>}>
                <SupportServicesTable />
            </Suspense>

            {/* Dashboard Ad */}
            <section className="px-4 py-5 lg:px-5">
                <div className="h-65.5 overflow-hidden rounded-[20px]">
                    {isVideo ? (
                        <ReactPlayer
                            src={adMediaUrl}
                            width="100%"
                            height="100%"
                            muted
                            playing
                            loop
                            className="object-cover"
                        />
                    ) : (
                        <Image src={adMediaUrl} alt="" className="size-full object-cover" width={600} height={262} />
                    )}
                </div>
            </section>

            {/* Upcoming Meetings and Events. */}
            <Suspense fallback={<></>}>
                <MeetingsAndEventsTable />
            </Suspense>
        </>
    );
};

export default DashboardPage;
