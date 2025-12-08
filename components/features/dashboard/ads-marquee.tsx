import db from "@/lib/db";
import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";
import Link from "next/link";

const AdsMarquee = async ({ className }: React.ComponentProps<"aside">) => {
    const breakingNewsItems = await db.breakingNews.findMany({
        where: {
            status: true,
            startDate: {
                lte: new Date(),
            },
            endDate: {
                gte: new Date(),
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    if (!breakingNewsItems || breakingNewsItems.length === 0) return null;

    const duplicatedBreakingNewsItems = Array.from({ length: 5 }).flatMap((_, outerIndex) =>
        breakingNewsItems.map((news) => ({
            ...news,
            uniqueKey: `${news.id}-${outerIndex}`,
        })),
    );

    return (
        <aside
            className={cn(
                "bg-destructive lg:w-[calc(100%-var(--sidebar-width))] lg:px-15 hover:[&_:is(ul)]:paused",
                className,
            )}
        >
            <div className="flex h-13.5 items-center gap-(--marquee-gap) overflow-hidden mask-x-from-90% text-white [--direction:alternate] [--marquee-gap:calc(var(--spacing)*5)]">
                {Array.from({ length: 2 }, (_, i) => (
                    <ul key={i} className="flex animate-marquee items-center gap-(--marquee-gap) whitespace-nowrap">
                        {duplicatedBreakingNewsItems.map((news) => (
                            <li key={news.uniqueKey} className="flex items-center gap-(--marquee-gap)">
                                <Dot />
                                {news.linkUrl ? (
                                    <Link href={news.linkUrl} target="_blank" rel="noopener noreferrer">
                                        <p>{news.headline}</p>
                                    </Link>
                                ) : (
                                    <p>{news.headline}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </aside>
    );
};

export default AdsMarquee;
