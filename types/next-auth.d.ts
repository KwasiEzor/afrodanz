import type { Role, SubscriptionStatus } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /** Optional on adapter user; set from DB on sign-in. */
  interface User {
    role?: Role;
    subscriptionStatus?: SubscriptionStatus | null;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      subscriptionStatus: SubscriptionStatus | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    subscriptionStatus?: SubscriptionStatus | null;
  }
}
