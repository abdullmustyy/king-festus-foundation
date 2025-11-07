import MeetingsAndEventsTable from "@/components/features/tables/meetings-and-events";
import { SupportServicesTable } from "@/components/features/tables/support-services";
import DashboardVolunteerImage from "@/public/images/dashboard-volunteer-image.svg";
import Image from "next/image";
import { Suspense } from "react";

const DashboardPage = () => {
    return (
        <>
            {/* Support Services */}
            <Suspense fallback={<></>}>
                <SupportServicesTable />
            </Suspense>

            {/* Media */}
            <section className="p-5">
                <div className="h-65.5 rounded-[20px] overflow-hidden">
                    <Image src={DashboardVolunteerImage} alt="" className="size-full object-cover" />
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
