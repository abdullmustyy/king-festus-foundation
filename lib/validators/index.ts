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
        error: "Passwords do not match",
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
        error: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const VerifyFormSchema = z.object({
    pin: z.string().min(6, "PIN must be 6 characters"),
});

const MAX_FILE_SIZE = 500000; // 500KB
const MAX_CMS_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const AddImageFormSchema = z.object({
    image: z
        .instanceof(File, { error: "Image is required." })
        .refine((file) => file, "Image is required.")
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 500KB.`)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), ".jpg, .jpeg, .png and .webp files are accepted."),
    description: z.string().optional(),
});

export const LandingPageMediaFormSchema = z.object({
    image: z
        .instanceof(File, { error: "Image is required." })
        .refine((file) => file, "Image is required.")
        .refine((file) => file?.size <= MAX_CMS_FILE_SIZE, `Max file size is 3MB.`)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), ".jpg, .jpeg, .png and .webp files are accepted."),
});

export const GovernanceStructureFormSchema = z.object({
    governanceBodies: z
        .array(
            z.object({
                id: z.string().optional(),
                image: z
                    .union([
                        z
                            .instanceof(File)
                            .refine((file) => file.size <= MAX_CMS_FILE_SIZE, `Max file size is 3MB.`)
                            .refine(
                                (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
                                ".jpg, .jpeg, .png and .webp files are accepted.",
                            ),
                        z.string(),
                        z.undefined(),
                        z.null(),
                    ])
                    .optional(),
                name: z.string().optional(),
                role: z.string().optional(),
            }),
        )
        .refine((bodies) => bodies.some((b) => b.name?.trim() && b.role?.trim() && b.image), {
            error: "At least one complete governance body member (Name, Role, and Image) is required.",
            path: [0, "role"],
        }),
});

export const AboutUsFormSchema = z.object({
    content: z.string().min(1, "Content is required"),
    missions: z
        .array(
            z.object({
                text: z.string().min(1, "Mission cannot be empty"),
            }),
        )
        .min(3)
        .max(3, "There must be exactly three missions"),
});

export const BreakingNewsFormSchema = z
    .object({
        headline: z.string().min(1, "Headline is required"),
        linkUrl: z.url("Invalid URL").min(1, "Link URL is required"),
        startDate: z.date({
            error: (issue) => (issue.input === undefined ? "Start date is required" : "Invalid date"),
        }),
        endDate: z.date({
            error: (issue) => (issue.input === undefined ? "End date is required" : "Invalid date"),
        }),
        status: z.boolean(),
    })
    .refine((data) => data.endDate >= data.startDate, {
        error: "End date cannot be before start date",
        path: ["endDate"],
    });

export const DashboardAdsFormSchema = z.object({
    adTitle: z.string().min(1, "Ad title is required"),
    adImage: z
        .instanceof(File, { error: "Ad image is required." })
        .refine((file) => file, "Ad image is required.")
        .refine((file) => file?.size <= MAX_CMS_FILE_SIZE, `Max file size is 3MB.`)
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), ".jpg, .jpeg, .png and .webp files are accepted."),
    status: z.boolean(),
});

export const AddAdminFormSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(["ADMIN", "USER"], "Role is required"),
});
