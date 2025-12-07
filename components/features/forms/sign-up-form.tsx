"use client";

import { syncUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SignUpFormSchema } from "@/lib/validators";
import { TSignUpForm, TVerifyForm } from "@/types";
import { useSignUp } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import VerifyForm from "./verify-form";

const SignUpForm = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const form = useForm<TSignUpForm>({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (data: TSignUpForm) => {
        if (!isLoaded) return;

        try {
            await signUp.create({
                firstName: data.firstName,
                lastName: data.lastName,
                emailAddress: data.email,
                password: data.password,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setVerifying(true);
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
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
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code: data.pin,
            });

            if (signUpAttempt.status === "complete") {
                await setActive({
                    session: signUpAttempt.createdSessionId,
                });

                await syncUser(); // Persist user data

                if (signUpAttempt.createdSessionId) {
                    router.push("/dashboard");
                }
            } else {
                console.error("Sign-up attempt not complete:", signUpAttempt);
                console.error("Sign-up attempt status:", signUpAttempt.status);
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

    if (verifying) {
        return <VerifyForm onSubmit={handleVerify} email={form.getValues("email")} />;
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 lg:px-6">
            <FieldGroup className="gap-3">
                <div className="grid gap-3 lg:grid-cols-2">
                    <FormField
                        name="firstName"
                        control={form.control}
                        label="First Name"
                        className="*:data-[slot='field-label']:text-foreground/50"
                    >
                        {(field, fieldState) => (
                            <div className="relative flex items-center">
                                <Input
                                    {...field}
                                    id={field.name}
                                    value={field.value}
                                    type="text"
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
                        name="lastName"
                        control={form.control}
                        label="Last Name"
                        className="*:data-[slot='field-label']:text-foreground/50"
                    >
                        {(field, fieldState) => (
                            <div className="relative flex items-center">
                                <Input
                                    {...field}
                                    id={field.name}
                                    value={field.value}
                                    type="text"
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
                </div>

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

                <div className="grid gap-3 lg:grid-cols-2">
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
                                    value={field.value}
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
                    <FormField
                        name="confirmPassword"
                        control={form.control}
                        label="Confirm Password"
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
                                    className="h-13 rounded-full bg-[#ECECEC] px-5"
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
            </FieldGroup>

            <Button size="xl" className="w-full rounded-full" isLoading={isSubmitting}>
                Sign Up
            </Button>

            <p className="flex items-center justify-center gap-1.5">
                Already have an account?
                <Link href="/auth/sign-in" className="font-semibold text-primary hover:underline">
                    Signin here
                </Link>
            </p>
        </form>
    );
};

export default SignUpForm;
