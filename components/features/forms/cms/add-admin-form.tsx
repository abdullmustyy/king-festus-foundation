"use client";

import { addAdmin } from "@/app/actions/cms/add-admin";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddAdminFormSchema } from "@/lib/validators";
import { TAddAdminForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface IAddAdminFormProps extends React.ComponentProps<"form"> {
    onComplete: () => void;
}

export default function AddAdminForm({ onComplete, id, ...props }: IAddAdminFormProps) {
    const form = useForm<TAddAdminForm>({
        resolver: zodResolver(AddAdminFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            role: "ADMIN",
        },
    });

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (data: TAddAdminForm) => {
        try {
            const res = await addAdmin(data);

            if (res.error) {
                toast.error(res.error);
                return;
            }

            toast.success("Admin user added successfully");
            onComplete();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong", {
                description: "Please try again later",
            });
        }
    };

    return (
        <div className="flex h-full flex-col">
            <section className="space-y-3 p-5">
                <h6>Manage admin users who can access the CMS.</h6>

                <FormProvider {...form}>
                    <form id={id} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" {...props}>
                        <FieldGroup className="flex flex-col gap-5">
                            <FormField
                                name="fullName"
                                control={control}
                                label="Full name"
                                className="*:data-[slot='field-label']:text-foreground/50"
                            >
                                {(field, fieldState) => (
                                    <Input
                                        {...field}
                                        value={field.value as string}
                                        placeholder="Enter full name"
                                        disabled={isSubmitting}
                                        aria-invalid={fieldState.invalid}
                                        className="h-11.25"
                                    />
                                )}
                            </FormField>

                            <FormField
                                name="email"
                                control={control}
                                label="Email"
                                className="*:data-[slot='field-label']:text-foreground/50"
                            >
                                {(field, fieldState) => (
                                    <Input
                                        {...field}
                                        value={field.value as string}
                                        type="email"
                                        placeholder="Enter email"
                                        disabled={isSubmitting}
                                        aria-invalid={fieldState.invalid}
                                        className="h-11.25"
                                    />
                                )}
                            </FormField>

                            <FormField
                                name="password"
                                control={control}
                                label="Password"
                                className="*:data-[slot='field-label']:text-foreground/50"
                            >
                                {(field, fieldState) => (
                                    <Input
                                        {...field}
                                        value={field.value as string}
                                        type="password"
                                        placeholder="Enter password"
                                        disabled={isSubmitting}
                                        aria-invalid={fieldState.invalid}
                                        className="h-11.25"
                                    />
                                )}
                            </FormField>

                            <FormField
                                name="role"
                                control={control}
                                label="Role"
                                className="*:data-[slot='field-label']:text-foreground/50"
                            >
                                {(field) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <SelectTrigger className="w-full data-[size=default]:h-11.25">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                            <SelectItem value="USER">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </FormField>
                        </FieldGroup>
                    </form>
                </FormProvider>
            </section>

            <div className="mt-auto flex items-center gap-3 border-t p-5">
                <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className="h-10 flex-1 text-sm"
                    onClick={() => onComplete()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    form={id}
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    className="h-10 flex-1 text-sm"
                >
                    Add admin
                </Button>
            </div>
        </div>
    );
}
