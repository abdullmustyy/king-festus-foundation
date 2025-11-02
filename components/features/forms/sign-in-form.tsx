"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SignInFormSchema } from "@/lib/validators";
import { TSignInForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

const SignInForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<TSignInForm>({
        resolver: zodResolver(SignInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    });

    const onSubmit = (data: TSignInForm) => {
        console.log(data);
    };

    return (
        <div className="flex flex-col gap-17.5 lg:px-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-7.5">
                <div className="flex flex-col gap-6">
                    <FieldGroup className="gap-4.5">
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
                                        className="bg-[#ECECEC] h-15.5 px-5 rounded-full"
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
                    </FieldGroup>

                    <div className="flex items-center justify-between">
                        <FormField
                            name="remember_me"
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
                            href="/forgot-password"
                            className="shrink-0 font-medium font-sf-pro text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button size="xl" className="w-full rounded-full">
                    Login
                </Button>
            </form>

            <p className="flex items-center justify-center gap-1.5">
                Don&apos;t have an account?
                <Link href="/sign-up" className="font-semibold text-primary hover:underline">
                    Signup here
                </Link>
            </p>
        </div>
    );
};

export default SignInForm;
