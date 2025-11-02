import * as z from "zod";

export const SignInFormSchema = z.object({
    email: z.email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required."),
    remember_me: z.boolean().default(false).optional(),
});

export const SignUpFormSchema = z
    .object({
        email: z.email("Please enter a valid email address."),
        password: z.string().min(8, "Password must be at least 8 characters long."),
        confirm_password: z.string().min(8, "Confirm password must be at least 8 characters long."),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match.",
        path: ["confirm_password"],
    });

export const ForgotPasswordFormSchema = z.object({
    email: z.email("Please enter a valid email address."),
});

export const ResetPasswordFormSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters long."),
});
