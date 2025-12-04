"use client";

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
}

export default function GovernanceStructureForm({
    onComplete,
    onSubmittingChange,
    id,
    ...props
}: IGovernanceStructureFormProps) {
    const form = useForm<TGovernanceStructureForm>({
        resolver: zodResolver(GovernanceStructureFormSchema),
        defaultValues: {
            governanceBodies: Array.from({ length: 6 }).map(() => ({
                image: undefined,
                name: "",
                role: "",
            })),
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

    const { fields } = useFieldArray({
        control,
        name: "governanceBodies",
    });

    const onSubmit = async (data: TGovernanceStructureForm) => {
        try {
            await Promise.all(
                data.governanceBodies.map((body) =>
                    uploadFiles("governanceBodyImage", {
                        files: [body.image],
                        input: { name: body.name, role: body.role },
                    }),
                ),
            );

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
                                                {({ isDragging, preview }) => (
                                                    <CmsImageFormField
                                                        name={`governanceBodies.${index}.image`}
                                                        isDragging={isDragging}
                                                        preview={preview}
                                                        onRemove={() => resetField(`governanceBodies.${index}.image`)}
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
