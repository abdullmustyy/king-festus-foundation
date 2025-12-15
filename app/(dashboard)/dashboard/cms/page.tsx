import { CMSTable } from "@/components/features/tables/cms";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function CMSPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/auth/sign-in");
    }

    const dbUser = await db.user.findUnique({
        where: { id: user.id },
        select: { role: true },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
        redirect("/dashboard");
    }

    // Fetch breaking news
    const breakingNews = await db.breakingNews.findMany({
        orderBy: { createdAt: "desc" },
    });
    // Fetch governance bodies with their media assets
    const governanceBodies = await db.governanceBody.findMany({
        include: {
            mediaAsset: true,
        },
    });
    // Fetch dashboard ads with their media assets
    const dashboardAds = await db.dashboardAd.findMany({
        include: { mediaAsset: true },
        orderBy: { createdAt: "desc" },
    });
    // Fetch landing page data
    const landingPage = await db.landingPage.findFirst();
    // Fetch landing page media
    const landingPageMedia = await db.landingPageMedia.findMany({
        include: {
            mediaAsset: true,
        },
    });
    // Fetch about us data
    const aboutUs = await db.aboutUs.findFirst({
        include: {
            missions: true,
            media: {
                include: {
                    mediaAsset: true,
                },
            },
        },
    });
    // Determine the latest update time among governance bodies
    const latestGovernanceUpdate = governanceBodies.reduce((latest, current) => {
        return current.updatedAt > latest ? current.updatedAt : latest;
    }, new Date(0));

    // Fetch latest admin update
    const latestAdminUpdate = await db.user.findFirst({
        where: { role: "ADMIN" },
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true },
    });

    return (
        <>
            <div className="px-4 pt-5 lg:px-5">
                <h1 className="font-medium">Content management system</h1>
            </div>
            <Suspense fallback={<></>}>
                <CMSTable
                    breakingNewsData={breakingNews}
                    governanceBodiesData={governanceBodies}
                    dashboardAdData={dashboardAds}
                    landingPageData={landingPage}
                    aboutUsData={aboutUs}
                    latestGovernanceUpdate={latestGovernanceUpdate}
                    landingPageMediaData={landingPageMedia}
                    latestAdminUpdate={latestAdminUpdate?.updatedAt || null}
                />
            </Suspense>
        </>
    );
}
