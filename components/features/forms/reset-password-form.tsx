"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import FormField from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ResetPasswordFormSchema } from "@/lib/validators";
import { TResetPasswordForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ResetPasswordForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<TResetPasswordForm>({
        resolver: zodResolver(ResetPasswordFormSchema),
        defaultValues: {
            password: "",
        },
        mode: "onChange",
    });

    const onSubmit = (data: TResetPasswordForm) => {
        console.log(data);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-7.5 lg:px-6">
            <FieldGroup className="gap-4.5">
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

            <div className="space-y-2">
                <Button size="xl" className="w-full rounded-full">
                    Enter new password
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

export default ResetPasswordForm;
