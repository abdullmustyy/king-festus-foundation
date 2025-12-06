import { Button } from "@/components/ui/button";
import { FileVideo, ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";

interface CmsImageFormFieldProps {
    name: string;
    preview: string | null;
    file?: File | null;
    isDragging: boolean;
    isSubmitting: boolean;
    onRemove: () => void;
}

export function CmsImageFormField({ preview, file, isDragging, isSubmitting, onRemove }: CmsImageFormFieldProps) {
    const isVideo = () => {
        if (file) return file.type.startsWith("video/");
        if (preview) {
            const ext = preview.split(".").pop()?.toLowerCase();
            return ["mp4", "webm", "mov", "ogg"].includes(ext || "");
        }
        return false;
    };

    const isVideoFile = isVideo();

    return (
        <div className="flex h-25 w-full items-center gap-4 rounded-lg bg-[#F7F7F7] px-3 py-4">
            <div className="relative flex h-full w-27.5 shrink-0 items-center justify-center rounded-md bg-white ring-1 ring-border/20">
                {preview ? (
                    <>
                        {isVideoFile ? (
                            <div className="relative size-full overflow-hidden rounded-md bg-black">
                                <video src={preview} className="size-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <FileVideo className="size-6 text-white/80" />
                                </div>
                            </div>
                        ) : (
                            <Image src={preview} alt="preview" fill className="rounded-md object-cover" />
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={isSubmitting}
                            className="absolute -top-1 -right-1 z-10 size-4 cursor-pointer rounded-full bg-[#1F1F1F]/90 hover:bg-[#1F1F1F]"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                        >
                            <XIcon className="size-3 text-white" />
                        </Button>
                    </>
                ) : (
                    <ImageIcon className="size-8 text-muted-foreground/40" />
                )}
            </div>

            <div className="flex flex-col items-start justify-center gap-1 text-left">
                <p className="text-sm font-medium text-[#18181B]">{preview ? "Choose another file" : "Upload media"}</p>
                <p className="text-xs text-[#71717A]">{isDragging ? "Drop to upload" : "Click or drag to upload"}</p>
            </div>
        </div>
    );
}
