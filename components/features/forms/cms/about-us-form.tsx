"use client";

import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { AboutUsFormSchema } from "@/lib/validators";
import { TAboutUsForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

interface IAboutUsFormProps extends React.ComponentProps<"form"> {
    onComplete: () => void;
}

export default function AboutUsForm({ onComplete, id, ...props }: IAboutUsFormProps) {
    const form = useForm<TAboutUsForm>({
        resolver: zodResolver(AboutUsFormSchema),
        defaultValues: {
            content: "",
            missions: Array.from({ length: 3 }).map(() => ({
                text: "",
            })),
        },
    });

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const { fields } = useFieldArray({
        control,
        name: "missions",
    });

    const onSubmit = async () => onComplete();

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

                            {fields.map((field, index) => (
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
                    </FieldGroup>
                </form>
            </FormProvider>
        </section>
    );
}
