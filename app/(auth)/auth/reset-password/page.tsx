"use client";

import ResetPasswordForm from "@/components/features/forms/reset-password-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ResetPasswordPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    useEffect(() => {
        if (!email) {
            router.push("/auth/forgot-password");
        }
    }, [email, router]);

    if (!email) {
        return null;
    }

    return (
        <div className="flex flex-col justify-center gap-8 py-5">
            <div className="space-y-2.5 text-center">
                <h1 className="text-4xl leading-[100%]">Reset password</h1>
                <p className="font-sf-pro text-xl text-foreground/50">
                    We&apos;ve sent a password reset code to <span className="font-medium">{email}</span>. Enter a new
                    password now to access your account.
                </p>
            </div>

            <ResetPasswordForm />
        </div>
    );
};

export default ResetPasswordPage;
