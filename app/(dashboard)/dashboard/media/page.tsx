"use client";

import AddImageForm from "@/components/features/forms/add-image-form";
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
import { DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
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
            <section className="flex flex-col gap-5 p-5">
                <div className="flex items-center justify-between">
                    <h6 className="font-medium">Media</h6>

                    <Button size="sm" className="rounded-full text-sm" onClick={() => setOpen((prevOpen) => !prevOpen)}>
                        Add image
                    </Button>
                </div>

                {/* Media gallery */}
                <div className="columns-2 gap-2.5 lg:columns-3 2xl:columns-4">
                    {gallery.map((image, index) => (
                        <div key={index} className="mb-2.5 break-inside-avoid">
                            <Image src={image} alt="" className="h-auto w-full" />
                        </div>
                    ))}
                </div>
            </section>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="gap-0 p-0 *:data-[slot='dialog-close']:hidden">
                    <DialogHeader className="h-13 flex-row items-center justify-between border-b px-5 py-3">
                        <>
                            <DialogTitle>Add image</DialogTitle>
                            <DialogDescription className="sr-only">Add image</DialogDescription>
                        </>

                        <div className="flex items-center gap-2">
                            <DialogClose asChild>
                                <X className="size-3.75 cursor-pointer text-[#52525B]" />
                            </DialogClose>
                            <div className="flex h-4 items-center justify-center rounded-sm border border-[#E4E4E7] bg-[#FAFAFA] px-1">
                                <span className="text-xs font-medium text-[#52525B]">esc</span>
                            </div>
                        </div>
                    </DialogHeader>

                    <AddImageForm />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MediaPage;
