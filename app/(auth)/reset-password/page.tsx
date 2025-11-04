import ResetPasswordForm from "@/components/features/forms/reset-password-form";

const ResetPasswordPage = () => {
    return (
        <div className="flex flex-col justify-center gap-8">
            <div className="space-y-2.5 text-center">
                <h1 className="text-4xl leading-[100%]">Reset password</h1>
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
