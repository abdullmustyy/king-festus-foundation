import SignInForm from "@/components/features/forms/sign-in-form";

const SignInPage = () => {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-4xl leading-[100%] lg:text-left text-center">
                <span className="text-foreground/50">Welcome to </span>
                <br className="md-br" />
                <span>King Festus Foundation</span>
            </h1>

            <SignInForm />
        </div>
    );
};

export default SignInPage;
