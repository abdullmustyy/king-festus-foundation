"use client";

import { Button } from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { VerifyFormSchema } from "@/lib/validators";
import { TVerifyForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface IVerifyFormProps {
    onSubmit: (data: TVerifyForm) => void;
    email: string;
}

const VerifyForm = ({ onSubmit, email }: IVerifyFormProps) => {
    const form = useForm<TVerifyForm>({
        resolver: zodResolver(VerifyFormSchema),
        defaultValues: {
            pin: "",
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 lg:px-6">
            <FormField
                name="pin"
                control={form.control}
                label={
                    <span>
                        Please enter the 6-digit code we sent to <span className="font-semibold">{email}</span>
                    </span>
                }
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
            <Button size="xl" className="w-full rounded-full" isLoading={isSubmitting}>
                Submit
            </Button>
        </form>
    );
};

export default VerifyForm;
