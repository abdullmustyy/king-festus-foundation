import SignUpForm from "@/components/features/forms/sign-up-form";

const SignUpPage = () => {
    return (
        <div className="flex flex-col justify-center gap-8 py-5">
            <h1 className="text-4xl leading-[100%] lg:text-left text-center">
                <span className="text-foreground/50">Welcome to </span>
                <br className="md-br" />
                <span>King Festus Foundation</span>
            </h1>

            <SignUpForm />
        </div>
    );
};

export default SignUpPage;
