"use client";

import { updateGovernanceStructure } from "@/app/actions/cms/governance-structure";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import UploadMediaTrigger from "@/components/ui/upload-media-trigger";
import { uploadFiles } from "@/lib/uploadthing";
import { GovernanceStructureFormSchema } from "@/lib/validators";
import { TGovernanceStructureForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Info } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CmsImageFormField } from "./cms-image-form-field";

interface IGovernanceStructureFormProps extends React.ComponentProps<"form"> {
    onComplete: () => void;
    onSubmittingChange?: (isSubmitting: boolean) => void;
    initialData?: Partial<TGovernanceStructureForm> | null;
}

export default function GovernanceStructureForm({
    onComplete,
    onSubmittingChange,
    initialData,
    id,
    ...props
}: IGovernanceStructureFormProps) {
    const form = useForm<TGovernanceStructureForm>({
        resolver: zodResolver(GovernanceStructureFormSchema),
        defaultValues: {
            governanceBodies:
                initialData?.governanceBodies && initialData.governanceBodies.length > 0
                    ? [
                          ...initialData.governanceBodies.map((b) => ({
                              id: b.id,
                              image: b.image,
                              mediaAssetId: b.mediaAssetId,
                              name: b.name,
                              role: b.role,
                          })),
                          // Pad with empty objects until length 7
                          ...Array.from({ length: Math.max(0, 6 - initialData.governanceBodies.length) }).map(() => ({
                              id: undefined,
                              image: undefined,
                              mediaAssetId: undefined,
                              name: "",
                              role: "",
                          })),
                      ]
                    : Array.from({ length: 6 }).map(() => ({
                          id: undefined,
                          image: undefined,
                          mediaAssetId: undefined,
                          name: "",
                          role: "",
                      })),
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

    const { fields } = useFieldArray({
        control,
        name: "governanceBodies",
    });

    const onSubmit = async (data: TGovernanceStructureForm) => {
        try {
            const validBodies = data.governanceBodies.filter(
                (b) => b.name?.trim() && b.role?.trim() && b.image !== undefined,
            );

            const processedBodies = await Promise.all(
                validBodies.map(async (body) => {
                    let imageUrl = body.image;
                    let mediaAssetId = body.mediaAssetId;

                    if (body.image instanceof File) {
                        const res = await uploadFiles("governanceBodyImage", {
                            files: [body.image],
                        });
                        if (res && res[0]) {
                            imageUrl = res[0].ufsUrl;
                            mediaAssetId = res[0].serverData?.id; // Capture mediaAssetId
                        }
                    }

                    return {
                        id: body.id,
                        name: body.name!,
                        role: body.role!,
                        image: imageUrl as string,
                        mediaAssetId: mediaAssetId as string | undefined,
                    };
                }),
            );

            const res = await updateGovernanceStructure({ governanceBodies: processedBodies });

            if (res.error) {
                toast.error(res.error);
                return;
            }

            toast.success("Governance structure updated successfully");
            onComplete();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong", {
                description: "Please try again later",
            });
        }
    };

    return (
        <FormProvider {...form}>
            <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-5" {...props}>
                <FieldGroup className="flex flex-col gap-5">
                    {fields.map((field, index) => (
                        <Collapsible key={field.id} defaultOpen={index === 0} className="flex flex-col gap-3">
                            <CollapsibleTrigger
                                className="flex w-full cursor-pointer items-center justify-between *:[[data-state=open]>span]:text-base *:[[data-state=open]>svg]:rotate-90"
                                disabled={isSubmitting}
                            >
                                <span className="text-sm font-medium transition-[font-size] duration-200">
                                    Governance body {index + 1}
                                </span>
                                <ChevronRight className="size-4 transition-transform duration-200" />
                            </CollapsibleTrigger>

                            <CollapsibleContent className="space-y-4">
                                <FormField
                                    name={`governanceBodies.${index}.image`}
                                    control={control}
                                    label="Image"
                                    className="*:data-[slot='field-label']:text-foreground/50"
                                >
                                    {(_, fieldState) => (
                                        <div className="space-y-3">
                                            <UploadMediaTrigger
                                                name={`governanceBodies.${index}.image`}
                                                disabled={isSubmitting}
                                                aria-invalid={fieldState.invalid}
                                            >
                                                {({ isDragging, preview, file }) => (
                                                    <CmsImageFormField
                                                        name={`governanceBodies.${index}.image`}
                                                        isDragging={isDragging}
                                                        isSubmitting={isSubmitting}
                                                        preview={preview}
                                                        file={file}
                                                        onRemove={() =>
                                                            setValue(`governanceBodies.${index}.image`, undefined, {
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

                                <FormField
                                    name={`governanceBodies.${index}.name`}
                                    control={control}
                                    label="Name"
                                    className="*:data-[slot='field-label']:text-foreground/50"
                                >
                                    {(field, fieldState) => (
                                        <Input
                                            {...field}
                                            value={field.value as string}
                                            placeholder="Name"
                                            disabled={isSubmitting}
                                            aria-invalid={fieldState.invalid}
                                            className="h-11.25"
                                        />
                                    )}
                                </FormField>

                                <FormField
                                    name={`governanceBodies.${index}.role`}
                                    control={control}
                                    label="Role"
                                    className="*:data-[slot='field-label']:text-foreground/50"
                                >
                                    {(field, fieldState) => (
                                        <Input
                                            {...field}
                                            value={field.value as string}
                                            placeholder="Role"
                                            disabled={isSubmitting}
                                            aria-invalid={fieldState.invalid}
                                            className="h-11.25"
                                        />
                                    )}
                                </FormField>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </FieldGroup>
            </form>
        </FormProvider>
    );
}
