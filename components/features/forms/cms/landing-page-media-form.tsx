import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import UploadMediaTrigger from "@/components/ui/upload-media-trigger";
import { uploadFiles } from "@/lib/uploadthing";
import { LandingPageMediaFormSchema } from "@/lib/validators";
import { TLandingPageMediaForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CmsImageFormField } from "./cms-image-form-field";

import { useEffect } from "react";

interface ILandingPageMediaFormProps extends React.ComponentProps<"form"> {
    onComplete: () => void;
    onSubmittingChange?: (isSubmitting: boolean) => void;
}

const LandingPageMediaForm = ({ onComplete, onSubmittingChange, id, ...props }: ILandingPageMediaFormProps) => {
    const form = useForm<TLandingPageMediaForm>({
        resolver: zodResolver(LandingPageMediaFormSchema),
        defaultValues: {
            image: undefined,
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    useEffect(() => {
        onSubmittingChange?.(isSubmitting);
    }, [isSubmitting, onSubmittingChange]);

    const onSubmit = async (data: TLandingPageMediaForm) => {
        try {
            const res = await uploadFiles("landingPageHeroImage", {
                files: [data.image],
            });

            if (!res) {
                throw new Error("Failed to upload image");
            }

            toast.success("Hero image updated successfully");
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
            <h6>Media on landing page</h6>

            <FormProvider {...form}>
                <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8" {...props}>
                    <FieldGroup className="gap-5">
                        <FormField
                            name="image"
                            control={form.control}
                            label="Image"
                            className="*:data-[slot='field-label']:text-foreground/50"
                        >
                            {() => (
                                <div className="space-y-3">
                                    <UploadMediaTrigger name="image" disabled={isSubmitting}>
                                        {({ isDragging, preview }) => (
                                            <CmsImageFormField
                                                name="image"
                                                isDragging={isDragging}
                                                isSubmitting={isSubmitting}
                                                preview={preview}
                                                onRemove={() => form.resetField("image")}
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
                    </FieldGroup>
                </form>
            </FormProvider>
        </section>
    );
};

export default LandingPageMediaForm;
