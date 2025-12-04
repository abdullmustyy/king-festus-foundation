"use client";

import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import UploadMediaTrigger from "@/components/ui/upload-media-trigger";
import { DashboardAdsFormSchema } from "@/lib/validators";
import { TDashboardAdsForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CmsImageFormField } from "./cms-image-form-field";

interface IDashboardAdsFormProps extends React.ComponentProps<"form"> {
    onComplete: () => void;
    onSubmittingChange?: (isSubmitting: boolean) => void;
}

export default function DashboardAdsForm({ onComplete, onSubmittingChange, id, ...props }: IDashboardAdsFormProps) {
    const form = useForm<TDashboardAdsForm>({
        resolver: zodResolver(DashboardAdsFormSchema),
        defaultValues: {
            adTitle: "",
            adImage: undefined,
            status: false,
        },
    });

    const {
        control,
        handleSubmit,
        resetField,
        formState: { isSubmitting },
    } = form;

    useEffect(() => {
        onSubmittingChange?.(isSubmitting);
    }, [isSubmitting, onSubmittingChange]);

    const onSubmit = async () => onComplete();

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
                                    >
                                        {({ isDragging, preview }) => (
                                            <CmsImageFormField
                                                name="adImage"
                                                isDragging={isDragging}
                                                preview={preview}
                                                onRemove={() => resetField("adImage")}
                                            />
                                        )}
                                    </UploadMediaTrigger>
                                    <div className="flex items-center gap-1">
                                        <Info className="size-4 fill-[#B47818] stroke-white" />
                                        <span className="text-xs text-[#693D11]">3MB Image, or less</span>
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
