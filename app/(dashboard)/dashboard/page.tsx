import { SupportServicesTable } from "@/components/features/tables/support-services";
// import { Suspense } from "react";

const DashboardPage = () => {
    return (
        <>
            {/* Support Services Section */}
            <section className="flex flex-col gap-5 p-5">
                <div className="flex items-center justify-between">
                    <h6 className="font-medium">Support Services</h6>
                </div>

                {/* Support Services Table */}
                {/* <Suspense fallback={<div>Loading table...</div>}> */}
                <SupportServicesTable />
                {/* </Suspense> */}
            </section>
        </>
    );
};

export default DashboardPage;
