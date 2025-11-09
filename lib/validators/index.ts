import * as z from "zod";

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character",
    );

export const SignInFormSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().default(false).optional(),
});

export const SignUpFormSchema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const ForgotPasswordFormSchema = z.object({
    email: emailSchema,
});

export const ResetPasswordFormSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
        code: z.string().min(6, "Code must be 6 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const VerifyFormSchema = z.object({
    pin: z.string().min(6, "PIN must be 6 characters"),
});

const MAX_FILE_SIZE = 500000; // 500KB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const AddImageFormSchema = z.object({
    image: z
        .any()
        .refine((file) => file, "Image is required.")
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 500KB.`)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), ".jpg, .jpeg, .png and .webp files are accepted."),
    description: z.string().optional(),
});
