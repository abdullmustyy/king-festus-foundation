import MeetingsAndEventsTable from "@/components/features/tables/meetings-and-events";
import { SupportServicesTable } from "@/components/features/tables/support-services";
import DashboardVolunteerImage from "@/public/images/dashboard-volunteer-image.svg";
import Image from "next/image";
import { Suspense } from "react";

const DashboardPage = () => {
    return (
        <>
            {/* Support Services */}
            <section className="flex flex-col gap-5 p-5">
                <div className="flex items-center justify-between">
                    <h6 className="font-medium">Support Services</h6>
                </div>

                {/* Support Services Table */}
                <Suspense fallback={<></>}>
                    <SupportServicesTable />
                </Suspense>
            </section>

            {/* Media */}
            <section className="p-5">
                <div className="h-65.5 rounded-[20px] overflow-hidden">
                    <Image src={DashboardVolunteerImage} alt="" className="size-full object-cover" />
                </div>
            </section>

            {/* Upcoming Meetings and Events */}
            <section className="flex flex-col gap-5 p-5">
                <div className="flex items-center justify-between">
                    <h6 className="font-medium">Upcoming Meetings and Events</h6>
                </div>

                {/* Upcoming Meetings and Events Table */}
                <Suspense fallback={<></>}>
                    <MeetingsAndEventsTable />
                </Suspense>
            </section>
        </>
    );
};

export default DashboardPage;
