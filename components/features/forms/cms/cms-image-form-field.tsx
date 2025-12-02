import { Button } from "@/components/ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";

interface CmsImageFormFieldProps {
    name: string;
    preview: string | null;
    isDragging: boolean;
    onRemove: () => void;
}

export function CmsImageFormField({ preview, isDragging, onRemove }: CmsImageFormFieldProps) {
    return (
        <div className="flex h-25 w-full items-center gap-4 rounded-lg bg-[#F7F7F7] px-3 py-4">
            <div className="relative flex h-full w-27.5 shrink-0 items-center justify-center rounded-md bg-white ring-1 ring-border/20">
                {preview ? (
                    <>
                        <Image src={preview} alt="preview" fill className="rounded-md object-cover" />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
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
                <p className="text-sm font-medium text-[#18181B]">
                    {preview ? "Choose another image" : "Upload image"}
                </p>
                <p className="text-xs text-[#71717A]">{isDragging ? "Drop to upload" : "Click or drag to upload"}</p>
            </div>
        </div>
    );
}
