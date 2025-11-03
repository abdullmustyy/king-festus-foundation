import ForgotPasswordForm from "@/components/features/forms/forgot-password-form";

const ForgotPasswordPage = () => {
    return (
        <div className="flex flex-col justify-center gap-8 lg:w-1/2">
            <div className="space-y-2.5 text-center">
                <h1 className="text-4xl leading-[100%]">Forgot password?</h1>
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
