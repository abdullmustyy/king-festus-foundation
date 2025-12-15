"use client";

import { manageLandingPageMedia } from "@/app/actions/cms/landing-page-media";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import UploadMediaTrigger from "@/components/ui/upload-media-trigger";
import { LandingPageMedia, MediaAsset } from "@/generated/prisma/client";
import { uploadFiles } from "@/lib/uploadthing";
import { LandingPageMediaFormSchema } from "@/lib/validators";
import { TLandingPageMediaForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CmsImageFormField } from "./cms-image-form-field";

interface ILandingPageMediaFormProps extends React.ComponentProps<"form"> {
    onComplete: () => void;
    onSubmittingChange?: (isSubmitting: boolean) => void;
    initialData?: (LandingPageMedia & { mediaAsset: MediaAsset | null })[] | null;
}

const LandingPageMediaForm = ({
    onComplete,
    onSubmittingChange,
    id,
    initialData,
    ...props
}: ILandingPageMediaFormProps) => {
    const form = useForm<TLandingPageMediaForm>({
        resolver: zodResolver(LandingPageMediaFormSchema),
        defaultValues: {
            landingPageMedia:
                initialData && initialData.length > 0
                    ? initialData.map((media) => ({
                          mediaId: media.id,
                          image: media.mediaAsset?.url,
                          mediaAssetId: media.mediaAssetId || undefined,
                      }))
                    : [{ image: undefined, mediaId: undefined, mediaAssetId: undefined }],
        },
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "landingPageMedia",
    });

    useEffect(() => {
        onSubmittingChange?.(isSubmitting);
    }, [isSubmitting, onSubmittingChange]);

    const onSubmit = async (data: TLandingPageMediaForm) => {
        try {
            const validMedia = data.landingPageMedia.filter((media) => media.image !== undefined);

            const processedMedia = await Promise.all(
                validMedia.map(async (media) => {
                    let imageUrl = media.image;
                    let mediaAssetId = media.mediaAssetId;

                    if (media.image instanceof File) {
                        const res = await uploadFiles("landingPageMedia", {
                            files: [media.image],
                        });

                        if (res && res[0]) {
                            imageUrl = res[0].ufsUrl;
                            mediaAssetId = res[0].serverData?.id;
                        }
                    }

                    return {
                        ...media,
                        image: imageUrl,
                        mediaAssetId: mediaAssetId,
                    };
                }),
            );

            const res = await manageLandingPageMedia({ landingPageMedia: processedMedia });

            if (res.error) {
                toast.error(res.error);
                return;
            }

            toast.success("Landing page media updated successfully");

            onComplete();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong", {
                description: "Please try again later",
            });
        }
    };

    return (
        <section className="space-y-3 p-5">
            <h6>Media on landing page</h6>

            <FormProvider {...form}>
                <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" {...props}>
                    <FieldGroup className="flex flex-col gap-5">
                        {fields.map((field, index) => (
                            <Collapsible key={field.id} defaultOpen={index === 0} className="flex flex-col gap-3">
                                <div className="flex w-full items-center justify-between">
                                    <CollapsibleTrigger
                                        className="flex w-full cursor-pointer items-center justify-between *:[[data-state=open]>span]:text-base *:[[data-state=open]>svg]:rotate-90"
                                        disabled={isSubmitting}
                                    >
                                        <span className="text-sm font-medium transition-[font-size] duration-200">
                                            Media {index + 1}
                                        </span>
                                    </CollapsibleTrigger>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        disabled={isSubmitting || fields.length === 1}
                                    >
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </div>

                                <CollapsibleContent className="space-y-4">
                                    <FormField
                                        name={`landingPageMedia.${index}.image`}
                                        control={control}
                                        label="Image"
                                        className="*:data-[slot='field-label']:text-foreground/50"
                                    >
                                        {(_, fieldState) => (
                                            <div className="space-y-3">
                                                <UploadMediaTrigger
                                                    name={`landingPageMedia.${index}.image`}
                                                    disabled={isSubmitting}
                                                    aria-invalid={fieldState.invalid}
                                                    accept={{
                                                        "image/*": [".jpg", ".jpeg", ".png", ".webp", ".svg"],
                                                    }}
                                                    maxSize={2 * 1024 * 1024}
                                                >
                                                    {({ isDragging, preview, file }) => (
                                                        <CmsImageFormField
                                                            name={`landingPageMedia.${index}.image`}
                                                            isDragging={isDragging}
                                                            isSubmitting={isSubmitting}
                                                            preview={preview}
                                                            file={file}
                                                            onRemove={() =>
                                                                setValue(`landingPageMedia.${index}.image`, undefined, {
                                                                    shouldValidate: true,
                                                                    shouldDirty: true,
                                                                })
                                                            }
                                                        />
                                                    )}
                                                </UploadMediaTrigger>
                                                <div className="flex items-center gap-1">
                                                    <Info className="size-4 fill-[#B47818] stroke-white" />
                                                    <span className="text-xs text-[#693D11]">2MB Image, or less</span>
                                                </div>
                                            </div>
                                        )}
                                    </FormField>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </FieldGroup>
                    <Button
                        type="button"
                        size="icon"
                        onClick={() =>
                            append({
                                image: undefined,
                                mediaId: undefined,
                                mediaAssetId: undefined,
                            })
                        }
                        disabled={isSubmitting}
                        className="mx-auto rounded-full"
                    >
                        <PlusCircle className="size-4" />
                    </Button>
                </form>
            </FormProvider>
        </section>
    );
};

export default LandingPageMediaForm;
