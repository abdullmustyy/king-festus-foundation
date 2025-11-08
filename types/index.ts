import { ForgotPasswordFormSchema, ResetPasswordFormSchema, SignInFormSchema, SignUpFormSchema, VerifyFormSchema } from "@/lib/validators";
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
