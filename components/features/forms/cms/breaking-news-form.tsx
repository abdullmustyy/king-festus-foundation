"use client";

import { CalendarDatePicker } from "@/components/ui/calendar-date-picker";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BreakingNewsFormSchema } from "@/lib/validators";
import { TBreakingNewsForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

interface IBreakingNewsFormProps extends React.ComponentProps<"form"> {
    onComplete: () => void;
}

export default function BreakingNewsForm({ onComplete, id, ...props }: IBreakingNewsFormProps) {
    const form = useForm<TBreakingNewsForm>({
        resolver: zodResolver(BreakingNewsFormSchema),
        defaultValues: {
            headline: "",
            linkUrl: "",
            startDate: undefined,
            endDate: undefined,
            status: false,
        },
    });

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async () => onComplete();

    return (
        <section className="space-y-3 p-5">
            <h6>Scroll bar with breaking news</h6>

            <FormProvider {...form}>
                <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" {...props}>
                    <FieldGroup className="flex flex-col gap-5">
                        <FormField
                            name="headline"
                            control={control}
                            label="Headline"
                            className="*:data-[slot='field-label']:text-foreground/50"
                        >
                            {(field, fieldState) => (
                                <Input
                                    {...field}
                                    value={field.value as string}
                                    placeholder="Enter headline"
                                    disabled={isSubmitting}
                                    aria-invalid={fieldState.invalid}
                                    className="h-11.25"
                                />
                            )}
                        </FormField>

                        <FormField
                            name="linkUrl"
                            control={control}
                            label="Link/URL"
                            className="*:data-[slot='field-label']:text-foreground/50"
                        >
                            {(field, fieldState) => (
                                <Input
                                    {...field}
                                    value={field.value as string}
                                    placeholder="Enter URL"
                                    disabled={isSubmitting}
                                    aria-invalid={fieldState.invalid}
                                    className="h-11.25"
                                />
                            )}
                        </FormField>

                        <div className="flex flex-col gap-5 md:flex-row">
                            <FormField
                                name="startDate"
                                control={control}
                                label="Start date"
                                className="flex-1 *:data-[slot='field-label']:text-foreground/50"
                            >
                                {(field, fieldState) => (
                                    <CalendarDatePicker
                                        date={field.value as Date | undefined}
                                        setDate={field.onChange}
                                        disabled={isSubmitting}
                                        id="start-date"
                                        ariaInvalid={fieldState.invalid}
                                        className="**:data-[slot='input']:h-11.25"
                                    />
                                )}
                            </FormField>
                            <FormField
                                name="endDate"
                                control={control}
                                label="End date"
                                className="flex-1 *:data-[slot='field-label']:text-foreground/50"
                            >
                                {(field, fieldState) => (
                                    <CalendarDatePicker
                                        date={field.value as Date | undefined}
                                        setDate={field.onChange}
                                        disabled={isSubmitting}
                                        id="end-date"
                                        ariaInvalid={fieldState.invalid}
                                        className="**:data-[slot='input']:h-11.25"
                                    />
                                )}
                            </FormField>
                        </div>

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
