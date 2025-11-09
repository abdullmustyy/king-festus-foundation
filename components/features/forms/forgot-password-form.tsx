"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ForgotPasswordFormSchema } from "@/lib/validators";
import { TForgotPasswordForm } from "@/types";
import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ForgotPasswordForm = () => {
    const { isLoaded, signIn } = useSignIn();
    const router = useRouter();
    const form = useForm<TForgotPasswordForm>({
        resolver: zodResolver(ForgotPasswordFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (data: TForgotPasswordForm) => {
        if (!isLoaded) return;

        try {
            await signIn.create({
                identifier: data.email,
                strategy: "reset_password_email_code",
            });
            router.push(`/auth/reset-password?email=${data.email}`);
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            if (isClerkAPIResponseError(err)) {
                err.errors.forEach((error) => {
                    toast.error(error.longMessage);
                });
            }
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 lg:px-6">
            <FormField name="email" control={form.control} className="*:data-[slot='field-label']:text-foreground/50">
                {(field, fieldState) => (
                    <div className="relative flex items-center">
                        <Input
                            {...field}
                            id={field.name}
                            value={field.value}
                            type="email"
                            aria-invalid={fieldState.invalid}
                            className="h-13 rounded-full bg-[#ECECEC] px-5"
                        />
                        {!fieldState.invalid && fieldState.isDirty && (
                            <div className="pointer-events-none absolute right-4 flex size-9 items-center justify-center">
                                <Check className="size-4 text-primary" />
                            </div>
                        )}
                    </div>
                )}
            </FormField>

            <div className="space-y-2">
                <Button size="xl" className="w-full rounded-full" isLoading={isSubmitting}>
                    Send reset code
                </Button>
                <Link href="/auth/sign-in" className={cn(buttonVariants({ size: "xl", variant: "link" }), "w-full")}>
                    <ArrowLeft className="size-5" />
                    Back to login
                </Link>
            </div>

            <p className="flex items-center justify-center gap-1.5">
                Don&apos;t have an account?
                <Link href="/auth/sign-up" className="font-semibold text-primary hover:underline">
                    Signup here
                </Link>
            </p>
        </form>
    );
};

export default ForgotPasswordForm;
