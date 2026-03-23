import { CredentialsSignin } from "next-auth";

export const authErrorCodes = {
  invalidCredentials: "invalid_credentials",
  emailNotVerified: "email_not_verified",
  authUnavailable: "auth_unavailable",
} as const;

export class InvalidCredentialsError extends CredentialsSignin {
  code = authErrorCodes.invalidCredentials;
}

export class EmailNotVerifiedError extends CredentialsSignin {
  code = authErrorCodes.emailNotVerified;
}

export class AuthUnavailableError extends CredentialsSignin {
  code = authErrorCodes.authUnavailable;
}
