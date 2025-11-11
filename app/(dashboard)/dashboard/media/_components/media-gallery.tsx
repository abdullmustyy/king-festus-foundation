"use client";

import { utapi } from "@/app/api/uploadthing/core";
import AddImageForm from "@/components/features/forms/add-image-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface IMediaGalleryProps {
    gallery: Awaited<ReturnType<typeof utapi.listFiles>>["files"];
}

const MediaGallery = ({ gallery }: IMediaGalleryProps) => {
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
                <div className="columns-2 gap-1.5 lg:columns-3 lg:gap-2.5 2xl:columns-4">
                    {gallery.map(({ key, name }) => (
                        <div key={key} className="relative mb-1.5 break-inside-avoid lg:mb-2.5">
                            <Image
                                src={`https://hcyular991.ufs.sh/f/${key}`}
                                alt={name}
                                className="h-auto w-full"
                                fill
                            />
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

                    <AddImageForm setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MediaGallery;
