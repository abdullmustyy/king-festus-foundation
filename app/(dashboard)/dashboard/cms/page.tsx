import { CMSTable } from "@/components/features/tables/cms";
import db from "@/lib/db";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function CMSPage() {
    const breakingNews = await db.breakingNews.findFirst();

    return (
        <>
            <div className="px-4 pt-5 lg:px-5">
                <h1 className="font-medium">Content management system</h1>
            </div>
            <Suspense fallback={<></>}>
                <CMSTable breakingNewsData={breakingNews} />
            </Suspense>
        </>
    );
}
