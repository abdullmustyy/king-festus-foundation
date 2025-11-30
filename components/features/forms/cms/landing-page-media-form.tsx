"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import InfoCircle from "@/components/ui/icons/info-circle";
import UploadMediaTrigger from "@/components/ui/upload-media-trigger";
import { LandingPageMediaFormSchema } from "@/lib/validators";
import { TLandingPageMediaForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";

interface ILandingPageMediaFormProps extends React.ComponentProps<"form"> {
    onUploadComplete: () => void;
}

const LandingPageMediaForm = ({ onUploadComplete, id, ...props }: ILandingPageMediaFormProps) => {
    const form = useForm<TLandingPageMediaForm>({
        resolver: zodResolver(LandingPageMediaFormSchema),
        defaultValues: {
            image: undefined,
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    const onSubmit = async () => onUploadComplete();

    return (
        <section className="space-y-3 p-5">
            <h6>Media on landing page</h6>

            <FormProvider {...form}>
                <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8" {...props}>
                    <FieldGroup className="gap-5">
                        <FormField
                            name="image"
                            control={form.control}
                            label="Image"
                            className="*:data-[slot='field-label']:text-foreground/50"
                        >
                            {() => (
                                <div className="space-y-3">
                                    <UploadMediaTrigger name="image" disabled={isSubmitting}>
                                        {({ isDragging, preview }) => (
                                            <div className="flex h-25 w-full items-center gap-4 rounded-lg bg-[#F7F7F7] px-3 py-4">
                                                <div className="relative flex h-full w-27.5 shrink-0 items-center justify-center rounded-md bg-white ring-1 ring-border/20">
                                                    {preview ? (
                                                        <>
                                                            <Image
                                                                src={preview}
                                                                alt="preview"
                                                                fill
                                                                className="rounded-md object-cover"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute -top-1 -right-1 z-10 size-4 cursor-pointer rounded-full bg-[#1F1F1F]/90 hover:bg-[#1F1F1F]"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    form.resetField("image");
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
                                                    <p className="text-xs text-[#71717A]">
                                                        {isDragging ? "Drop to upload" : "Click or drag to upload"}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </UploadMediaTrigger>

                                    <div className="flex items-center gap-1">
                                        <InfoCircle className="size-4 text-[#B47818]" />
                                        <span className="text-xs text-[#693D11]">3MB Image, or less</span>
                                    </div>
                                </div>
                            )}
                        </FormField>
                    </FieldGroup>
                </form>
            </FormProvider>
        </section>
    );
};

export default LandingPageMediaForm;
