import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";

const AdsMarquee = ({ className }: React.ComponentProps<"aside">) => {
    return (
        <aside className={cn("bg-destructive whitespace-nowrap", className)}>
            <div className=" h-13.5 flex items-center gap-(--marquee-gap) text-white overflow-hidden hover:[&_:is(ul)]:paused [--direction:alternate] [--marquee-gap:calc(var(--spacing)*5)]">
                {Array.from({ length: 2 }, (_, index) => (
                    <ul key={index} className="flex items-center gap-(--marquee-gap) shrink-0 animate-marquee">
                        {Array.from({ length: 8 }, (_, index) => (
                            <li key={index} className="flex items-center gap-(--marquee-gap)">
                                <Dot />
                                <p>Breaking News</p>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </aside>
    );
};

export default AdsMarquee;
