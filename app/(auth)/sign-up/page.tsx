import SignUpForm from "@/components/features/forms/sign-up-form";

const SignUpPage = () => {
    return (
        <div className="flex flex-col gap-12.5 w-full">
            <h1 className="text-[2.8125rem] leading-[100%]">
                <span className="text-foreground/50">Welcome to </span>
                <br className="md-br" />
                <span>King Festus Foundation</span>
            </h1>

            <SignUpForm />
        </div>
    );
};

export default SignUpPage;
