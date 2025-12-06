"use client";

import { updateDashboardAd } from "@/app/actions/cms/dashboard-ads";
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
import { Info } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CmsImageFormField } from "./cms-image-form-field";

interface IDashboardAdsFormProps extends React.ComponentProps<"form"> {
    onComplete: () => void;
    onSubmittingChange?: (isSubmitting: boolean) => void;
    initialData?: (DashboardAd & { mediaAsset: MediaAsset | null }) | null;
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
            adTitle: initialData?.title || "",
            adImage: initialData?.mediaAsset?.url || undefined,
            status: initialData?.status || false,
            adId: initialData?.id || undefined,
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

    const onSubmit = async (data: TDashboardAdsForm) => {
        try {
            if (data.adImage instanceof File) {
                const res = await uploadFiles("dashboardAdMedia", {
                    files: [data.adImage],
                    input: {
                        title: data.adTitle,
                        status: data.status,
                        adId: data.adId,
                    },
                });

                if (!res) {
                    throw new Error("Failed to upload ad image");
                }
            } else {
                if (!data.adId) {
                    // Should technically not happen if validator works and we are in "edit" mode without file change?
                    // But if creating new ad without file... validator prevents it (adImage required).
                    // So this block is for updating existing ad without changing image.
                    throw new Error("Ad ID missing for update");
                }

                const res = await updateDashboardAd({
                    adId: data.adId,
                    title: data.adTitle,
                    status: data.status,
                });

                if (res.error) {
                    throw new Error(res.error);
                }
            }

            toast.success("Dashboard ad updated successfully");

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
                        <FormField
                            name="adTitle"
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
                            name="adImage"
                            control={control}
                            label="Ads Image/Video"
                            className="*:data-[slot='field-label']:text-foreground/50"
                        >
                            {(_, fieldState) => (
                                <div className="space-y-3">
                                    <UploadMediaTrigger
                                        name="adImage"
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
                                                name="adImage"
                                                isDragging={isDragging}
                                                isSubmitting={isSubmitting}
                                                preview={preview}
                                                file={file}
                                                mediaType={initialData?.mediaAsset?.type}
                                                onRemove={() =>
                                                    setValue("adImage", undefined, {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    })
                                                }
                                            />
                                        )}
                                    </UploadMediaTrigger>
                                    <div className="flex items-center gap-1">
                                        <Info className="size-4 fill-[#B47818] stroke-white" />
                                        <span className="text-xs text-[#693D11]">8MB Image/Video, or less</span>
                                    </div>
                                </div>
                            )}
                        </FormField>

                        <FormField
                            name="status"
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
                    </FieldGroup>
                </form>
            </FormProvider>
        </section>
    );
}
