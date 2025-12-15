"use client";

import { updateAboutUs } from "@/app/actions/cms/about-us";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import UploadMediaTrigger from "@/components/ui/upload-media-trigger";
import { AboutUs, AboutUsMedia, MediaAsset, Mission } from "@/generated/prisma/client";
import { uploadFiles } from "@/lib/uploadthing";
import { AboutUsFormSchema } from "@/lib/validators";
import { TAboutUsForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CmsImageFormField } from "./cms-image-form-field";

interface IAboutUsFormProps extends React.ComponentProps<"form"> {
    onComplete: () => void;
    onSubmittingChange?: (isSubmitting: boolean) => void;
    initialData?:
        | (AboutUs & {
              missions: Mission[];
              media: (AboutUsMedia & { mediaAsset: MediaAsset })[];
          })
        | null;
}

export default function AboutUsForm({ onComplete, onSubmittingChange, id, initialData, ...props }: IAboutUsFormProps) {
    const form = useForm<TAboutUsForm>({
        resolver: zodResolver(AboutUsFormSchema),
        defaultValues: {
            content: initialData?.vision || "",
            missions:
                initialData?.missions && initialData.missions.length === 3
                    ? initialData.missions.map((m) => ({ text: m.text }))
                    : Array.from({ length: 3 }).map(() => ({
                          text: "",
                      })),
            media:
                initialData?.media && initialData.media.length > 0
                    ? initialData.media.map((m) => ({
                          mediaId: m.id,
                          image: m.mediaAsset.url,
                          mediaAssetId: m.mediaAssetId,
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

    useEffect(() => {
        onSubmittingChange?.(isSubmitting);
    }, [isSubmitting, onSubmittingChange]);

    const { fields: missionFields } = useFieldArray({
        control,
        name: "missions",
    });

    const {
        fields: mediaFields,
        append: appendMedia,
        remove: removeMedia,
    } = useFieldArray({
        control,
        name: "media",
    });

    const onSubmit = async (data: TAboutUsForm) => {
        try {
            const validMedia = data.media?.filter((media) => media.image !== undefined) || [];

            const processedMedia = await Promise.all(
                validMedia.map(async (media) => {
                    let imageUrl = media.image;
                    let mediaAssetId = media.mediaAssetId;

                    if (media.image instanceof File) {
                        const res = await uploadFiles("aboutUsMedia", {
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

            const res = await updateAboutUs({
                ...data,
                media: processedMedia,
            });

            if (res.error) {
                toast.error(res.error);
                return;
            }

            toast.success("About Us section updated successfully");
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
            <h6>About us</h6>

            <FormProvider {...form}>
                <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" {...props}>
                    <FieldGroup className="flex flex-col gap-5">
                        <FieldSet>
                            <FieldLegend variant="label">Vision</FieldLegend>

                            <FormField
                                name="content"
                                control={control}
                                label="Content"
                                className="*:data-[slot='field-label']:text-foreground/50"
                            >
                                {(field, fieldState) => (
                                    <Textarea
                                        {...field}
                                        value={field.value as string}
                                        disabled={isSubmitting}
                                        aria-invalid={fieldState.invalid}
                                        className="h-42.5 resize-none"
                                    />
                                )}
                            </FormField>
                        </FieldSet>

                        <FieldSet>
                            <FieldLegend variant="label">Mission</FieldLegend>

                            {missionFields.map((field, index) => (
                                <FormField
                                    key={field.id}
                                    name={`missions.${index}.text`}
                                    control={control}
                                    label={`Mission ${index + 1}`}
                                    className="*:data-[slot='field-label']:text-foreground/50"
                                >
                                    {(field, fieldState) => (
                                        <Textarea
                                            {...field}
                                            value={field.value as string}
                                            disabled={isSubmitting}
                                            aria-invalid={fieldState.invalid}
                                            className="h-28.25 resize-none"
                                        />
                                    )}
                                </FormField>
                            ))}
                        </FieldSet>

                        <FieldSet>
                            <FieldLegend variant="label">Media</FieldLegend>
                            <div className="flex flex-col gap-3">
                                {mediaFields.map((field, index) => (
                                    <Collapsible
                                        key={field.id}
                                        defaultOpen={index === 0}
                                        className="flex flex-col gap-3"
                                    >
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
                                                onClick={() => removeMedia(index)}
                                                disabled={isSubmitting}
                                            >
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>

                                        <CollapsibleContent className="space-y-4">
                                            <FormField
                                                name={`media.${index}.image`}
                                                control={control}
                                                label="Image"
                                                className="*:data-[slot='field-label']:text-foreground/50"
                                            >
                                                {(_, fieldState) => (
                                                    <div className="space-y-3">
                                                        <UploadMediaTrigger
                                                            name={`media.${index}.image`}
                                                            disabled={isSubmitting}
                                                            aria-invalid={fieldState.invalid}
                                                            accept={{
                                                                "image/*": [".jpg", ".jpeg", ".png", ".webp", ".svg"],
                                                            }}
                                                            maxSize={2 * 1024 * 1024}
                                                        >
                                                            {({ isDragging, preview, file }) => (
                                                                <CmsImageFormField
                                                                    name={`media.${index}.image`}
                                                                    isDragging={isDragging}
                                                                    isSubmitting={isSubmitting}
                                                                    preview={preview}
                                                                    file={file}
                                                                    onRemove={() =>
                                                                        setValue(`media.${index}.image`, undefined, {
                                                                            shouldValidate: true,
                                                                            shouldDirty: true,
                                                                        })
                                                                    }
                                                                />
                                                            )}
                                                        </UploadMediaTrigger>
                                                        <div className="flex items-center gap-1">
                                                            <Info className="size-4 fill-[#B47818] stroke-white" />
                                                            <span className="text-xs text-[#693D11]">
                                                                2MB Image, or less
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </FormField>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ))}
                                <Button
                                    type="button"
                                    size="icon"
                                    onClick={() =>
                                        appendMedia({
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
                            </div>
                        </FieldSet>
                    </FieldGroup>
                </form>
            </FormProvider>
        </section>
    );
}
