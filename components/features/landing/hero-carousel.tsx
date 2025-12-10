"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { LandingPageMedia, MediaAsset } from "@/generated/prisma/client";
import HeroVolunteerImage from "@/public/images/hero-volunteer-image.svg";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRef } from "react";

interface HeroCarouselProps {
    media: (LandingPageMedia & { mediaAsset: MediaAsset | null })[];
}

export function HeroCarousel({ media }: HeroCarouselProps) {
    const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }));

    if (media.length === 0) {
        return (
            <Image
                src={HeroVolunteerImage}
                alt="Hero Volunteer Image"
                sizes="(max-width: 1024px) 100vw, 50vw"
                fill
                className="object-contain"
                priority
            />
        );
    }

    return (
        <Carousel
            plugins={[plugin.current]}
            className="size-full *:size-full"
            opts={{
                loop: true,
            }}
        >
            <CarouselContent className="h-full">
                {media.map((item) => {
                    const mediaUrl = item.mediaAsset?.url;

                    if (!mediaUrl) return null;

                    return (
                        <CarouselItem key={item.id} className="relative">
                            <Image
                                src={mediaUrl}
                                alt={item.mediaAsset?.name || "Landing Page Media"}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                fill
                                className="object-contain"
                                priority
                            />
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
        </Carousel>
    );
}
