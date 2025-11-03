"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ForgotPasswordFormSchema } from "@/lib/validators";
import { TForgotPasswordForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

const ForgotPasswordForm = () => {
    const form = useForm<TForgotPasswordForm>({
        resolver: zodResolver(ForgotPasswordFormSchema),
        defaultValues: {
            email: "",
        },
        mode: "onChange",
    });

    const onSubmit = (data: TForgotPasswordForm) => {
        console.log(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-7.5 lg:px-6">
            <FieldGroup>
                <FormField
                    name="email"
                    control={form.control}
                    className="*:data-[slot='field-label']:text-foreground/50"
                >
                    {(field, fieldState) => (
                        <div className="relative flex items-center">
                            <Input
                                {...field}
                                id={field.name}
                                value={field.value as string}
                                type="email"
                                aria-invalid={fieldState.invalid}
                                className="bg-[#ECECEC] h-15.5 px-5 rounded-full"
                            />
                            {!fieldState.invalid && fieldState.isDirty && (
                                <div className="pointer-events-none absolute right-4 size-9 flex items-center justify-center">
                                    <Check className="size-4 text-primary" />
                                </div>
                            )}
                        </div>
                    )}
                </FormField>
            </FieldGroup>

            <div className="space-y-2">
                <Button size="xl" className="w-full rounded-full">
                    Send reset link
                </Button>
                <Link href="/sign-in" className={cn(buttonVariants({ size: "xl", variant: "link" }), "w-full")}>
                    <ArrowLeft className="size-5" />
                    Back to login
                </Link>
            </div>

            <p className="flex items-center justify-center gap-1.5">
                Don&apos;t have an account?
                <Link href="/sign-up" className="font-semibold text-primary hover:underline">
                    Signup here
                </Link>
            </p>
        </form>
    );
};

export default ForgotPasswordForm;
