import ForgotPasswordForm from "@/components/features/forms/forgot-password-form";

const ForgotPasswordPage = () => {
    return (
        <div className="flex flex-col gap-12.5 w-full">
            <div className="space-y-2.5 text-center">
                <h1 className="text-[2.8125rem] leading-[100%]">Forgot password?</h1>
                <p className="font-sf-pro text-xl text-foreground/50">
                    Enter your email address and a link to
                    <br className="md-br" /> reset your password would be sent there.
                </p>
            </div>

            <ForgotPasswordForm />
        </div>
    );
};

export default ForgotPasswordPage;
