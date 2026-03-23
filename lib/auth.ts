import NextAuth from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { Session, User } from "next-auth"
import { Role } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id
        token.role = user.role ?? Role.MEMBER
        token.subscriptionStatus = user.subscriptionStatus ?? null
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as Session["user"]["role"]) ?? Role.MEMBER
        session.user.subscriptionStatus =
          (token.subscriptionStatus as Session["user"]["subscriptionStatus"]) ?? null
      }
      return session
    },
  },
})
