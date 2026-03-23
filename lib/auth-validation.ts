import { z } from "zod";
import { isPasswordStrongEnough, MIN_PASSWORD_LENGTH } from "@/lib/password-strength";

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Enter your email address.")
  .email("Use a valid email address.");

const passwordField = z
  .string()
  .min(1, "Enter your password.")
  .min(
    MIN_PASSWORD_LENGTH,
    `Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`
  );

export const credentialsSignInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password."),
});

export const emailRegistrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Enter your name.")
      .max(80, "Use 80 characters or fewer for your name."),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    if (!isPasswordStrongEnough(value.password)) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message:
          "Use uppercase, lowercase, a number, and either a symbol or 12+ characters.",
      });
    }
  });
