import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import {
  AuthUnavailableError,
  EmailNotVerifiedError,
  InvalidCredentialsError,
} from "@/lib/auth-errors";
import { credentialsSignInSchema } from "@/lib/auth-validation";
import { isSupabaseAuthConfigured, isSupabaseEmailNotConfirmedError, isSupabaseInvalidCredentialsError, signInWithSupabaseEmailPassword } from "@/lib/supabase-auth";
import { syncSupabaseUserToPrisma } from "@/lib/sync-supabase-user";

export const authProviderAvailability = {
  credentials: isSupabaseAuthConfigured,
  github:
    Boolean(process.env.AUTH_GITHUB_ID) &&
    Boolean(process.env.AUTH_GITHUB_SECRET),
  google:
    Boolean(process.env.AUTH_GOOGLE_ID) &&
    Boolean(process.env.AUTH_GOOGLE_SECRET),
} as const;

const providers: NonNullable<NextAuthConfig["providers"]> = [];

if (authProviderAvailability.credentials) {
  providers.push(
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSignInSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          throw new InvalidCredentialsError();
        }

        const response = await signInWithSupabaseEmailPassword(parsed.data).catch(
          (error: unknown) => {
            if (isSupabaseEmailNotConfirmedError(error)) {
              throw new EmailNotVerifiedError();
            }

            if (isSupabaseInvalidCredentialsError(error)) {
              throw new InvalidCredentialsError();
            }

            throw new AuthUnavailableError();
          }
        );

        if (response.error) {
          if (isSupabaseEmailNotConfirmedError(response.error)) {
            throw new EmailNotVerifiedError();
          }

          if (isSupabaseInvalidCredentialsError(response.error)) {
            throw new InvalidCredentialsError();
          }

          throw new AuthUnavailableError();
        }

        if (!response.data.user) {
          throw new InvalidCredentialsError();
        }

        const user = await syncSupabaseUserToPrisma(response.data.user);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
        };
      },
    })
  );
}

if (authProviderAvailability.github) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  );
}

if (authProviderAvailability.google) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

export const authConfig = {
  trustHost: true,
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isAdmin = nextUrl.pathname.startsWith("/admin");

      if (isAdmin) {
        return auth?.user?.role === "ADMIN";
      }
      if (isDashboard) {
        return isLoggedIn;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
