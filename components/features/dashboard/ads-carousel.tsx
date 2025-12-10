"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { DashboardAd, MediaAsset } from "@/generated/prisma/client";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRef } from "react";
import ReactPlayer from "react-player";

interface AdsCarouselProps {
    ads: (DashboardAd & { mediaAsset: MediaAsset | null })[];
}

export function AdsCarousel({ ads }: AdsCarouselProps) {
    const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }));

    if (!ads || ads.length === 0) return null;

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full overflow-hidden rounded-[20px]"
            opts={{
                loop: true,
            }}
        >
            <CarouselContent className="h-66">
                {ads.map((ad) => {
                    const adMediaUrl = ad.mediaAsset?.url;
                    const isVideo = ad.mediaAsset?.type === "VIDEO";

                    if (!adMediaUrl) return null;

                    return (
                        <CarouselItem key={ad.id} className="relative h-full bg-black/90">
                            {isVideo ? (
                                <ReactPlayer
                                    src={adMediaUrl}
                                    width="100%"
                                    height="100%"
                                    muted
                                    playing
                                    loop
                                    className="object-contain"
                                />
                            ) : (
                                <Image src={adMediaUrl} alt={ad.title} fill priority className="object-contain" />
                            )}
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
        </Carousel>
    );
}
