import { z } from "zod"

// Factory functions to create schemas with translated messages
export const createSignInSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t("please-enter-valid-email")),
  password: z.string().min(8, t("password-min-8-chars")),
})

export const createSignUpSchema = (t: (key: string) => string) => z
  .object({
    name: z.string().min(2, t("name-min-2-chars")),
    email: z.string().email(t("please-enter-valid-email")),
    password: z.string().min(8, t("password-min-8-chars")),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("passwords-dont-match"),
    path: ["confirmPassword"],
  })

export const createForgotPasswordSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t("please-enter-valid-email")),
})

export const createResetPasswordSchema = (t: (key: string) => string) => z
  .object({
    password: z.string().min(8, t("password-min-8-chars")),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("passwords-dont-match"),
    path: ["confirmPassword"],
  })

// Legacy exports for backward compatibility (with English messages)
export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
