import { PastAnnouncementsTable } from "@/components/features/tables/past-announcements";
import db from "@/lib/db";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function PastAnnouncementsPage() {
    const breakingNews = await db.breakingNews.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <>
            <div className="px-4 pt-5 lg:px-5">
                <h1 className="font-medium">Past announcements</h1>
            </div>
            <Suspense fallback={<></>}>
                <PastAnnouncementsTable data={breakingNews} />
            </Suspense>
        </>
    );
}
