import ResetPasswordForm from "@/components/features/forms/reset-password-form";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const ResetPasswordPage = async ({ searchParams }: { searchParams: Promise<{ email?: string }> }) => {
    const params = await searchParams;
    const email = params.email;

    if (!email) {
        redirect("/auth/forgot-password");
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
