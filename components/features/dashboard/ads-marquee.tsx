import db from "@/lib/db";
import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";
import Link from "next/link"; // Added import

const AdsMarquee = async ({ className }: React.ComponentProps<"aside">) => {
    const breakingNews = await db.breakingNews.findFirst({
        where: {
            status: true,
            startDate: {
                lte: new Date(),
            },
            endDate: {
                gte: new Date(),
            },
        },
    });

    if (!breakingNews) return null;

    return (
        <Link href={breakingNews.linkUrl} target="_blank" rel="noopener noreferrer">
            <aside
                className={cn(
                    "bg-destructive lg:w-[calc(100%-var(--sidebar-width))] lg:px-15 hover:[&_:is(ul)]:paused",
                    className,
                )}
            >
                <div className="flex h-13.5 items-center gap-(--marquee-gap) overflow-hidden mask-x-from-90% text-white [--direction:alternate] [--marquee-gap:calc(var(--spacing)*5)]">
                    {Array.from({ length: 2 }, (_, index) => (
                        <ul
                            key={index}
                            className="flex animate-marquee items-center gap-(--marquee-gap) whitespace-nowrap"
                        >
                            {Array.from({ length: 8 }, (_, index) => (
                                <li key={index} className="flex items-center gap-(--marquee-gap)">
                                    <Dot />
                                    <p>{breakingNews.headline}</p>
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </aside>
        </Link>
    );
};

export default AdsMarquee;
