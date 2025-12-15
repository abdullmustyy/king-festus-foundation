import * as z from "zod";

const MAX_FILE_SIZE = 500000; // 500KB
const MAX_CMS_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_MEDIA_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
const ACCEPTED_MEDIA_TYPES = [...ACCEPTED_IMAGE_TYPES, "video/mp4", "video/webm", "video/quicktime"];

const emailSchema = z.email({ message: "Invalid email address" });
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

export const AddImageFormSchema = z.object({
    image: z
        .instanceof(File, { error: "Image is required." })
        .refine((file) => file, "Image is required.")
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 500KB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            ".jpg, .jpeg, .png, .webp, and .svg files are accepted.",
        ),
    description: z.string().optional(),
});

export const LandingPageMediaFormSchema = z.object({
    landingPageMedia: z
        .array(
            z.object({
                mediaId: z.string().optional(),
                image: z
                    .union([
                        z
                            .instanceof(File)
                            .refine((file) => file.size <= MAX_CMS_FILE_SIZE, `Max file size is 2MB.`)
                            .refine(
                                (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
                                ".jpg, .jpeg, .png, .webp, and .svg files are accepted.",
                            ),
                        z.string(),
                        z.undefined(),
                        z.null(),
                    ])
                    .optional(),
                mediaAssetId: z.string().optional(),
            }),
        )
        .refine((media) => media.some((m) => m.image), {
            message: "At least one landing page media item with an image is required.",
            path: ["landingPageMedia.0.image"],
        }),
});

export type TLandingPageMediaForm = z.infer<typeof LandingPageMediaFormSchema>;

export const GovernanceStructureFormSchema = z.object({
    governanceBodies: z
        .array(
            z.object({
                id: z.string().optional(),
                image: z
                    .union([
                        z
                            .instanceof(File)
                            .refine((file) => file.size <= MAX_CMS_FILE_SIZE, `Max file size is 2MB.`)
                            .refine(
                                (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
                                ".jpg, .jpeg, .png, .webp, and .svg files are accepted.",
                            ),
                        z.string(),
                        z.undefined(),
                        z.null(),
                    ])
                    .optional(),
                mediaAssetId: z.string().optional(),
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
    media: z
        .array(
            z.object({
                mediaId: z.string().optional(),
                image: z
                    .union([
                        z
                            .instanceof(File)
                            .refine((file) => file.size <= MAX_CMS_FILE_SIZE, `Max file size is 2MB.`)
                            .refine(
                                (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
                                ".jpg, .jpeg, .png, .webp, and .svg files are accepted.",
                            ),
                        z.string(),
                        z.undefined(),
                        z.null(),
                    ])
                    .optional(),
                mediaAssetId: z.string().optional(),
            }),
        )
        .optional(),
});

export const BreakingNewsFormSchema = z.object({
    breakingNews: z.array(
        z
            .object({
                id: z.string().optional(),
                headline: z.string().min(1, "Headline is required"),
                linkUrl: z.url({ message: "Invalid URL" }).optional(),
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
            }),
    ),
});

export const DashboardAdsFormSchema = z.object({
    dashboardAds: z.array(
        z.object({
            adTitle: z.string().min(1, "Ad title is required"),
            adImage: z
                .union([
                    z
                        .instanceof(File, { error: "Ad image or video is required." })
                        .refine((file) => file, "Ad image or video is required.")
                        .refine((file) => file?.size <= MAX_MEDIA_FILE_SIZE, `Max file size is 8MB.`)
                        .refine(
                            (file) => ACCEPTED_MEDIA_TYPES.includes(file?.type),
                            ".jpg, .jpeg, .png, .webp, .svg, .mp4, .webm, and .mov files are accepted.",
                        ),
                    z.string(),
                    z.undefined(),
                    z.null(),
                ])
                .optional(),
            mediaAssetId: z.string().optional(),
            status: z.boolean(),
            adId: z.string().optional(),
        }),
    ),
});

export const AddAdminFormSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(["ADMIN", "USER"], "Role is required"),
});
