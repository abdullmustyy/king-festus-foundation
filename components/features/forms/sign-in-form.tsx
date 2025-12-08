"use client";

import { syncUser } from "@/app/actions/auth";
import VerifyForm from "@/components/features/forms/verify-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SignInFormSchema } from "@/lib/validators";
import { TSignInForm, TVerifyForm } from "@/types";
import { useSignIn } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const SignInForm = () => {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const form = useForm<TSignInForm>({
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    useEffect(() => {
        const shouldRemember = localStorage.getItem("rememberMe") === "true";

        if (shouldRemember) {
            const rememberedEmail = localStorage.getItem("rememberedEmail");
            if (rememberedEmail) {
                form.setValue("email", rememberedEmail);
                form.setValue("rememberMe", true);
            }
        }
    }, [form]);

    const {
        formState: { isSubmitting },
        getValues,
    } = form;

    const onSubmit = async (data: TSignInForm) => {
        if (!isLoaded) return;

        if (data.rememberMe) {
            localStorage.setItem("rememberedEmail", data.email);
            localStorage.setItem("rememberMe", "true");
        } else {
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberMe");
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: data.email,
                password: data.password,
            });

            if (signInAttempt.status === "complete") {
                await setActive({
                    session: signInAttempt.createdSessionId,
                });

                await syncUser(); // Persist user data

                if (signInAttempt.createdSessionId) {
                    router.push("/dashboard");
                }
            } else if (signInAttempt.status === "needs_second_factor") {
                const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
                    (factor) => factor.strategy === "email_code",
                );

                if (emailCodeFactor) {
                    await signIn.prepareFirstFactor({
                        strategy: "email_code",
                        emailAddressId: emailCodeFactor.emailAddressId,
                    });

                    setVerifying(true);
                    toast.message("Please check your email for a verification code.");
                } else {
                    console.error("No supported email_code second factor found.");
                    toast.error("Sign-in failed. 2FA required but email code not supported.");
                }
            } else {
                console.error("Sign-in not complete:", signInAttempt, "Status:", signInAttempt.status);
                toast.error("Sign-in failed. Please try again.");
            }
        } catch (err) {
            console.error(err);

            if (isClerkAPIResponseError(err)) {
                err.errors.forEach((error) => {
                    toast.error(error.longMessage);
                });
            }
        }
    };

    const handleVerify = async (data: TVerifyForm) => {
        if (!isLoaded) return;

        try {
            const signInAttempt = await signIn.attemptFirstFactor({
                strategy: "email_code",
                code: data.pin,
            });

            if (signInAttempt.status === "complete") {
                await setActive({
                    session: signInAttempt.createdSessionId,
                });

                await syncUser(); // Persist user data

                if (signInAttempt.createdSessionId) {
                    router.push("/dashboard");
                }
            } else {
                console.error("Sign-in not complete:", signInAttempt, "Status:", signInAttempt.status);
                toast.error("Verification failed. Please try again.");
            }
        } catch (err) {
            console.error(err);

            if (isClerkAPIResponseError(err)) {
                err.errors.forEach((error) => {
                    toast.error(error.longMessage);
                });
            }
        }
    };

    if (verifying) {
        return <VerifyForm onSubmit={handleVerify} email={getValues("email")} />;
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 lg:px-6">
            <FieldGroup className="gap-3">
                <FormField
                    name="email"
                    control={form.control}
                    label="Email address"
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

                <FormField
                    name="password"
                    control={form.control}
                    label="Password"
                    className="*:data-[slot='field-label']:text-foreground/50"
                >
                    {(field, fieldState) => (
                        <div className="relative flex items-center">
                            <Input
                                {...field}
                                id={field.name}
                                value={field.value as string}
                                type={showPassword ? "text" : "password"}
                                aria-invalid={fieldState.invalid}
                                className="h-13 rounded-full bg-[#ECECEC] px-5"
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

                <div className="flex items-center justify-between">
                    <FormField
                        name="rememberMe"
                        control={form.control}
                        label="Remember me"
                        orientation="horizontal"
                        className="flex-row-reverse *:data-[slot='field-label']:text-foreground/50"
                    >
                        {(field, fieldState) => (
                            <Checkbox
                                id={field.name}
                                name={field.name}
                                aria-invalid={fieldState.invalid}
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    </FormField>

                    <Link
                        href="/auth/forgot-password"
                        className="shrink-0 font-sf-pro font-medium text-primary hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
            </FieldGroup>

            <Button size="xl" className="w-full rounded-full" isLoading={isSubmitting}>
                Login
            </Button>

            <p className="flex items-center justify-center gap-1.5">
                Don&apos;t have an account?
                <Link href="/auth/sign-up" className="font-semibold text-primary hover:underline">
                    Signup here
                </Link>
            </p>
        </form>
    );
};

export default SignInForm;
