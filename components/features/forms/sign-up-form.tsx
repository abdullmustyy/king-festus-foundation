"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SignUpFormSchema } from "@/lib/validators";
import { TSignUpForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<TSignUpForm>({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            email: "",
            password: "",
            confirm_password: "",
        },
        mode: "onChange",
    });

    const onSubmit = (data: TSignUpForm) => {
        console.log(data);
    };

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
                                className="bg-[#ECECEC] h-13 px-5 rounded-full"
                            />
                            {!fieldState.invalid && fieldState.isDirty && (
                                <div className="pointer-events-none absolute right-4 size-9 flex items-center justify-center">
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
                    name="confirm_password"
                    control={form.control}
                    label="Confirm Password"
                    className="*:data-[slot='field-label']:text-foreground/50"
                >
                    {(field, fieldState) => (
                        <div className="relative flex items-center">
                            <Input
                                {...field}
                                id={field.name}
                                value={field.value as string}
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
            </FieldGroup>

            <Button size="xl" className="w-full rounded-full">
                Sign Up
            </Button>

            <p className="flex items-center justify-center gap-1.5">
                Already have an account?
                <Link href="/sign-in" className="font-semibold text-primary hover:underline">
                    Signin here
                </Link>
            </p>
        </form>
    );
};

export default SignUpForm;
