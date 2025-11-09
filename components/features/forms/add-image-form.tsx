"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import InfoCircle from "@/components/ui/icons/info-circle";
import { Textarea } from "@/components/ui/textarea";
import { AddImageFormSchema } from "@/lib/validators";
import { TAddImageForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download } from "lucide-react";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import UploadMediaTrigger from "../../ui/upload-media-trigger";

const AddImageForm = () => {
    const form = useForm<TAddImageForm>({
        resolver: zodResolver(AddImageFormSchema),
        defaultValues: {
            image: undefined,
            description: "",
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (data: TAddImageForm) => {
        try {
            // TODO: Handle image upload
            console.log(data);
            toast.success("Image added successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to add image.");
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 px-5 py-4">
                <FieldGroup className="gap-5">
                    <FormField
                        name="image"
                        control={form.control}
                        label={
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[#18181B]">
                                        Media <span className="text-[#71717A]">(Optional)</span>
                                    </span>
                                    <InfoCircle />
                                </div>
                                <p className="text-sm font-normal text-[#52525B]">
                                    Max file size is 500kb. Supported file types are .jpg and .png.
                                </p>
                            </div>
                        }
                        className="*:data-[slot='field-label']:text-foreground/50"
                    >
                        {() => (
                            <UploadMediaTrigger name="image">
                                {({ isDragging, preview }) => (
                                    <div className="grid h-58.5 place-content-center gap-1 rounded-lg border border-dashed border-[#D4D4D8] bg-[#FAFAFA] px-8 py-6 text-center">
                                        {preview ? (
                                            <div className="relative h-40 w-40">
                                                <Image src={preview} alt="preview" fill className="object-contain" />
                                            </div>
                                        ) : (
                                            <>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="mx-auto w-fit text-sm font-medium text-[#52525B]"
                                                >
                                                    <Download className="size-3.75" />
                                                    Import Files
                                                </Button>
                                                <p className="text-sm text-[#71717A]">
                                                    {isDragging
                                                        ? "Drop files here"
                                                        : "Drag and drop files here or click to upload"}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </UploadMediaTrigger>
                        )}
                    </FormField>

                    <FormField name="description" control={form.control}>
                        {(field, fieldState) => (
                            <Textarea
                                {...field}
                                id={field.name}
                                placeholder="Description"
                                aria-invalid={fieldState.invalid}
                                className="h-21 resize-none"
                            />
                        )}
                    </FormField>
                </FieldGroup>

                <Button className="w-full rounded-md text-sm" isLoading={isSubmitting}>
                    Upload
                </Button>
            </form>
        </FormProvider>
    );
};

export default AddImageForm;
