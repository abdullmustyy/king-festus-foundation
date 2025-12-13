"use client";

import { deleteMediaAction as deleteMedia } from "@/app/actions/cms/media";
import AddImageForm from "@/components/features/forms/add-image-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Prisma } from "@/generated/prisma/client";
import { PrismaPromise } from "@/generated/prisma/internal/prismaNamespace";
import { DialogClose } from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState, useTransition } from "react";
import { toast } from "sonner";

type MediaWithAsset = Prisma.MediaGetPayload<{
    include: { mediaAsset: true };
}>;

interface IMediaGalleryProps {
    mediaPromise: PrismaPromise<MediaWithAsset[]>;
    isAdmin: boolean;
}

const MediaGallery = ({ mediaPromise, isAdmin }: IMediaGalleryProps) => {
    const [open, setOpen] = useState(false);
    const media = use(mediaPromise);
    const { refresh } = useRouter();
    const [isPending, startTransition] = useTransition();

    const onUploadComplete = () => {
        setOpen(false);
        refresh();
    };

    const handleDelete = async (id: string) => {
        startTransition(async () => {
            const result = await deleteMedia(id);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Media deleted successfully");
            }
        });
    };

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
                    {media.map(({ id, mediaAsset, description }) => (
                        <div
                            key={id}
                            className="group relative mb-1.5 break-inside-avoid overflow-hidden rounded-md lg:mb-2.5"
                        >
                            <Image
                                src={mediaAsset?.url ?? ""}
                                alt={mediaAsset?.name ?? description ?? ""}
                                height={500}
                                width={500}
                                className="h-auto w-full object-cover"
                            />
                            {isAdmin && (
                                <div className="absolute right-4 bottom-0 translate-y-full rounded-t-full bg-background p-2 transition-transform duration-300 group-hover:translate-y-0 before:absolute before:bottom-0 before:left-0 before:-translate-x-full before:border-b-5 before:border-l-5 before:border-b-background before:border-l-transparent after:absolute after:right-0 after:bottom-0 after:translate-x-full after:border-r-5 after:border-b-5 after:border-r-transparent after:border-b-background">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(id)}
                                        disabled={isPending}
                                        isLoading={isPending}
                                        className="rounded-full"
                                    >
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </div>
                            )}
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
                            <div className="hidden h-4 items-center justify-center rounded-sm border border-[#E4E4E7] bg-[#FAFAFA] px-1 lg:flex">
                                <span className="text-xs font-medium text-[#52525B]">esc</span>
                            </div>
                        </div>
                    </DialogHeader>

                    <AddImageForm onUploadComplete={onUploadComplete} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MediaGallery;
