"use client";

import { manageDashboardAds } from "@/app/actions/cms/dashboard-ads";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import UploadMediaTrigger from "@/components/ui/upload-media-trigger";
import { DashboardAd, MediaAsset } from "@/generated/prisma/client";
import { uploadFiles } from "@/lib/uploadthing";
import { DashboardAdsFormSchema } from "@/lib/validators";
import { TDashboardAdsForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CmsImageFormField } from "./cms-image-form-field";

interface IDashboardAdsFormProps extends React.ComponentProps<"form"> {
    onComplete: () => void;
    onSubmittingChange?: (isSubmitting: boolean) => void;
    initialData?: (DashboardAd & { mediaAsset: MediaAsset | null })[] | null;
}

export default function DashboardAdsForm({
    onComplete,
    onSubmittingChange,
    id,
    initialData,
    ...props
}: IDashboardAdsFormProps) {
    const form = useForm<TDashboardAdsForm>({
        resolver: zodResolver(DashboardAdsFormSchema),
        defaultValues: {
            dashboardAds:
                initialData && initialData.length > 0
                    ? initialData.map((ad) => ({
                          adId: ad.id,
                          adTitle: ad.title,
                          adImage: ad.mediaAsset?.url,
                          mediaAssetId: ad.mediaAssetId || undefined,
                          status: ad.status,
                      }))
                    : [{ adTitle: "", adImage: undefined, status: true, adId: undefined }],
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
        name: "dashboardAds",
    });

    useEffect(() => {
        onSubmittingChange?.(isSubmitting);
    }, [isSubmitting, onSubmittingChange]);

    const onSubmit = async (data: TDashboardAdsForm) => {
        try {
            const validAds = data.dashboardAds.filter((ad) => ad.adTitle?.trim() && ad.adImage !== undefined);

            const processedAds = await Promise.all(
                validAds.map(async (ad) => {
                    let imageUrl = ad.adImage;
                    let mediaAssetId = ad.mediaAssetId;

                    if (ad.adImage instanceof File) {
                        const res = await uploadFiles("dashboardAdMedia", {
                            files: [ad.adImage],
                        });

                        if (res && res[0]) {
                            imageUrl = res[0].ufsUrl;
                            mediaAssetId = res[0].serverData?.id;
                        }
                    }

                    return {
                        ...ad,
                        adImage: imageUrl,
                        mediaAssetId: mediaAssetId,
                    };
                }),
            );

            const res = await manageDashboardAds({ dashboardAds: processedAds });

            if (res.error) {
                toast.error(res.error);
                return;
            }

            toast.success("Dashboard ads updated successfully");

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
            <h6>Advertisement section on dashboard</h6>

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
                                            Ad {index + 1}
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
                                        name={`dashboardAds.${index}.adTitle`}
                                        control={control}
                                        label="Ad title"
                                        className="*:data-[slot='field-label']:text-foreground/50"
                                    >
                                        {(field, fieldState) => (
                                            <Input
                                                {...field}
                                                value={field.value as string}
                                                placeholder="Enter ad title"
                                                disabled={isSubmitting}
                                                aria-invalid={fieldState.invalid}
                                                className="h-11.25"
                                            />
                                        )}
                                    </FormField>

                                    <FormField
                                        name={`dashboardAds.${index}.adImage`}
                                        control={control}
                                        label="Ads Image/Video"
                                        className="*:data-[slot='field-label']:text-foreground/50"
                                    >
                                        {(_, fieldState) => (
                                            <div className="space-y-3">
                                                <UploadMediaTrigger
                                                    name={`dashboardAds.${index}.adImage`}
                                                    disabled={isSubmitting}
                                                    aria-invalid={fieldState.invalid}
                                                    accept={{
                                                        "image/*": [".jpg", ".jpeg", ".png", ".webp", ".svg"],
                                                        "video/*": [".mp4", ".webm", ".mov"],
                                                    }}
                                                    maxSize={8 * 1024 * 1024}
                                                >
                                                    {({ isDragging, preview, file }) => (
                                                        <CmsImageFormField
                                                            name={`dashboardAds.${index}.adImage`}
                                                            isDragging={isDragging}
                                                            isSubmitting={isSubmitting}
                                                            preview={preview}
                                                            file={file}
                                                            mediaType={
                                                                file
                                                                    ? file.type.startsWith("video/")
                                                                        ? "VIDEO"
                                                                        : "IMAGE"
                                                                    : initialData?.[index]?.mediaAsset?.type
                                                            }
                                                            onRemove={() =>
                                                                setValue(`dashboardAds.${index}.adImage`, undefined, {
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
                                                        8MB Image/Video, or less
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </FormField>

                                    <FormField
                                        name={`dashboardAds.${index}.status`}
                                        control={control}
                                        className="*:data-[slot='field-label']:text-foreground/50"
                                        label="Status (Inactive/Active)"
                                    >
                                        {(field, fieldState) => (
                                            <Switch
                                                checked={field.value as boolean}
                                                onCheckedChange={field.onChange}
                                                disabled={isSubmitting}
                                                aria-invalid={fieldState.invalid}
                                                className="w-8!"
                                            />
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
                                adTitle: "",
                                adImage: undefined,
                                status: true,
                                adId: undefined,
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
}
