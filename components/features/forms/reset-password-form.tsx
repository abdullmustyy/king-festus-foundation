"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { ResetPasswordFormSchema } from "@/lib/validators";
import { TResetPasswordForm } from "@/types";
import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ResetPasswordForm = () => {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<TResetPasswordForm>({
        resolver: zodResolver(ResetPasswordFormSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
            code: "",
        },
        mode: "onChange",
    });

    const {
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (data: TResetPasswordForm) => {
        if (!isLoaded) return;

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code: data.code,
                password: data.password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else {
                console.error(result);
            }
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
            <FieldGroup className="gap-3">
                <div className="grid lg:grid-cols-2 gap-3">
                    <FormField
                        name="password"
                        control={form.control}
                        label="Enter new password"
                        className="*:data-[slot='field-label']:text-foreground/50"
                    >
                        {(field, fieldState) => (
                            <div className="relative flex items-center">
                                <Input
                                    {...field}
                                    id={field.name}
                                    value={field.value}
                                    type={showPassword ? "text" : "password"}
                                    aria-invalid={fieldState.invalid}
                                    className="bg-[#ECECEC] h-13 px-5 rounded-full"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 rounded-full text-primary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </Button>
                            </div>
                        )}
                    </FormField>

                    <FormField
                        name="confirmPassword"
                        control={form.control}
                        label="Confirm new password"
                        className="*:data-[slot='field-label']:text-foreground/50"
                    >
                        {(field, fieldState) => (
                            <div className="relative flex items-center">
                                <Input
                                    {...field}
                                    id={field.name}
                                    value={field.value}
                                    type={showConfirmPassword ? "text" : "password"}
                                    aria-invalid={fieldState.invalid}
                                    className="bg-[#ECECEC] h-13 px-5 rounded-full"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 rounded-full text-primary"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                </Button>
                            </div>
                        )}
                    </FormField>
                </div>

                <FormField
                    name="code"
                    control={form.control}
                    label="Verification code"
                    className="*:data-[slot='field-label']:text-foreground/50"
                >
                    {(field, fieldState) => (
                        <InputOTP maxLength={6} {...field} aria-invalid={fieldState.invalid}>
                            <InputOTPGroup className="w-full">
                                {Array.from({ length: 6 }, (_, index) => (
                                    <InputOTPSlot
                                        key={index}
                                        index={index}
                                        aria-invalid={fieldState.invalid}
                                        className="w-full h-13"
                                    />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    )}
                </FormField>
            </FieldGroup>

            <div className="space-y-2">
                <Button size="xl" className="w-full rounded-full" isLoading={isSubmitting}>
                    Reset password
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

export default ResetPasswordForm;
