"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Rectangle3726 from "@/public/images/Rectangle 3726.svg";
import Rectangle3727 from "@/public/images/Rectangle 3727.svg";
import Rectangle37281 from "@/public/images/Rectangle 3728-1.svg";
import Rectangle3728 from "@/public/images/Rectangle 3728.svg";
import Rectangle37291 from "@/public/images/Rectangle 3729-1.svg";
import Rectangle3729 from "@/public/images/Rectangle 3729.svg";
import Rectangle37301 from "@/public/images/Rectangle 3730-1.svg";
import Rectangle3730 from "@/public/images/Rectangle 3730.svg";
import Rectangle3731 from "@/public/images/Rectangle 3731.svg";
import Image from "next/image";
import { useState } from "react";

const gallery = [
    Rectangle3726,
    Rectangle3727,
    Rectangle37281,
    Rectangle3730,
    Rectangle3728,
    Rectangle37291,
    Rectangle3731,
    Rectangle3729,
    Rectangle37301,
];

const MediaPage = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <section className="p-5 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h6 className="font-medium">Media</h6>

                    <Button size="sm" className="rounded-full text-sm" onClick={() => setOpen((prevOpen) => !prevOpen)}>
                        Add gallery
                    </Button>
                </div>

                {/* Media gallery */}
                <div className="columns-2 lg:columns-3 2xl:columns-4 gap-2.5">
                    {gallery.map((image, index) => (
                        <div key={index} className="mb-2.5 break-inside-avoid">
                            <Image src={image} alt="" className="w-full h-auto" />
                        </div>
                    ))}
                </div>
            </section>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data
                            from our servers.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MediaPage;
