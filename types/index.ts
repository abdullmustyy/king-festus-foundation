import {
    AddImageFormSchema,
    ForgotPasswordFormSchema,
    GovernanceStructureFormSchema,
    LandingPageMediaFormSchema,
    ResetPasswordFormSchema,
    SignInFormSchema,
    SignUpFormSchema,
    VerifyFormSchema,
    AboutUsFormSchema,
    BreakingNewsFormSchema,
    DashboardAdsFormSchema,
    AddAdminFormSchema,
} from "@/lib/validators";
import z from "zod";

/**
 * Represents the data structure for the sign-in form, inferred from SignInFormSchema.
 */
export type TSignInForm = z.infer<typeof SignInFormSchema>;

/**
 * Represents the data structure for the sign-up form, inferred from SignUpFormSchema.
 */
export type TSignUpForm = z.infer<typeof SignUpFormSchema>;

/**
 * Represents the data structure for the forgot password form, inferred from ForgotPasswordFormSchema.
 */
export type TForgotPasswordForm = z.infer<typeof ForgotPasswordFormSchema>;

/**
 * Represents the data structure for the reset password form, inferred from ResetPasswordFormSchema.
 */
export type TResetPasswordForm = z.infer<typeof ResetPasswordFormSchema>;

/**
 * Represents the data structure for the verification form, inferred from VerifyFormSchema.
 */
export type TVerifyForm = z.infer<typeof VerifyFormSchema>;

/**
 * Represents the data structure for the add image form, inferred from AddImageFormSchema.
 */
export type TAddImageForm = z.infer<typeof AddImageFormSchema>;

/**
 * Represents the data structure for the landing page media form, inferred from LandingPageMediaFormSchema.
 */
export type TLandingPageMediaForm = z.infer<typeof LandingPageMediaFormSchema>;

/**
 * Represents the data structure for the governance structure form, inferred from GovernanceStructureFormSchema.
 */
export type TGovernanceStructureForm = z.infer<typeof GovernanceStructureFormSchema>;

/**
 * Represents the data structure for the about us form, inferred from AboutUsFormSchema.
 */
export type TAboutUsForm = z.infer<typeof AboutUsFormSchema>;

/**
 * Represents the data structure for the breaking news form, inferred from BreakingNewsFormSchema.
 */
export type TBreakingNewsForm = z.infer<typeof BreakingNewsFormSchema>;

/**
 * Represents the data structure for the dashboard ads form, inferred from DashboardAdsFormSchema.
 */
export type TDashboardAdsForm = z.infer<typeof DashboardAdsFormSchema>;

/**
 * Represents the data structure for the add admin form, inferred from AddAdminFormSchema.
 */
export type TAddAdminForm = z.infer<typeof AddAdminFormSchema>;
