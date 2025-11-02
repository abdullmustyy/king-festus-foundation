import ResetPasswordForm from "@/components/features/forms/reset-password-form";

const ResetPasswordPage = () => {
    return (
        <div className="flex flex-col gap-12.5 w-full">
            <div className="space-y-2.5 text-center">
                <h1 className="text-[2.8125rem] leading-[100%]">Reset password</h1>
                <p className="font-sf-pro text-xl text-foreground/50">
                    Enter a new password now to
                    <br className="md-br" /> access your account.
                </p>
            </div>

            <ResetPasswordForm />
        </div>
    );
};

export default ResetPasswordPage;
