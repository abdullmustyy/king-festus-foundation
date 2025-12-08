"use client";

import { manageBreakingNews } from "@/app/actions/cms/breaking-news";
import { Button } from "@/components/ui/button";
import { CalendarDatePicker } from "@/components/ui/calendar-date-picker";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BreakingNews } from "@/generated/prisma/client";
import { BreakingNewsFormSchema } from "@/lib/validators";
import { TBreakingNewsForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface IBreakingNewsFormProps extends React.ComponentProps<"form"> {
    onComplete: () => void;
    onSubmittingChange?: (isSubmitting: boolean) => void;
    initialData?: BreakingNews[] | null;
}

export default function BreakingNewsForm({
    onComplete,
    onSubmittingChange,
    initialData,
    id,
    ...props
}: IBreakingNewsFormProps) {
    const form = useForm<TBreakingNewsForm>({
        resolver: zodResolver(BreakingNewsFormSchema),
        defaultValues: {
            breakingNews:
                initialData && initialData.length > 0
                    ? initialData.map((news) => ({
                          ...news,
                          linkUrl: news.linkUrl ?? undefined,
                          startDate: news.startDate ? new Date(news.startDate) : new Date(),
                          endDate: news.endDate ? new Date(news.endDate) : addDays(new Date(), 1),
                      }))
                    : [
                          {
                              headline: "",
                              linkUrl: undefined,
                              startDate: new Date(),
                              endDate: addDays(new Date(), 1),
                              status: true,
                          },
                      ],
        },
    });

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "breakingNews",
    });

    useEffect(() => {
        onSubmittingChange?.(isSubmitting);
    }, [isSubmitting, onSubmittingChange]);

    const onSubmit = async (data: TBreakingNewsForm) => {
        try {
            const res = await manageBreakingNews(data);

            if (res.error) {
                toast.error(res.error);
                return;
            }

            toast.success("Breaking news managed successfully");

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
            <h6>Scroll bar with breaking news</h6>

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
                                            Breaking News {index + 1}
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
                                        name={`breakingNews.${index}.headline`}
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
                                        name={`breakingNews.${index}.linkUrl`}
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
                                            name={`breakingNews.${index}.startDate`}
                                            control={control}
                                            label="Start date"
                                            className="flex-1 *:data-[slot='field-label']:text-foreground/50"
                                        >
                                            {(field, fieldState) => (
                                                <CalendarDatePicker
                                                    date={field.value as Date | undefined}
                                                    setDate={field.onChange}
                                                    disabled={isSubmitting}
                                                    id={`start-date-${index}`}
                                                    ariaInvalid={fieldState.invalid}
                                                    className="**:data-[slot='input']:h-11.25"
                                                />
                                            )}
                                        </FormField>
                                        <FormField
                                            name={`breakingNews.${index}.endDate`}
                                            control={control}
                                            label="End date"
                                            className="flex-1 *:data-[slot='field-label']:text-foreground/50"
                                        >
                                            {(field, fieldState) => (
                                                <CalendarDatePicker
                                                    date={field.value as Date | undefined}
                                                    setDate={field.onChange}
                                                    disabled={isSubmitting}
                                                    id={`end-date-${index}`}
                                                    ariaInvalid={fieldState.invalid}
                                                    className="**:data-[slot='input']:h-11.25"
                                                />
                                            )}
                                        </FormField>
                                    </div>

                                    <FormField
                                        name={`breakingNews.${index}.status`}
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
                        onClick={() => {
                            const newStartDate = new Date();
                            const newEndDate = addDays(newStartDate, 1);

                            append({
                                headline: "",
                                linkUrl: undefined,
                                startDate: newStartDate,
                                endDate: newEndDate,
                                status: true,
                            });
                        }}
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
