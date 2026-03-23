import type { User as SupabaseUser } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";
import { getSupabaseAuthUserName } from "@/lib/supabase-auth";

function getConfirmedAt(user: SupabaseUser) {
  return user.email_confirmed_at ? new Date(user.email_confirmed_at) : null;
}

export async function syncSupabaseUserToPrisma(user: SupabaseUser) {
  const email = user.email?.trim().toLowerCase();

  if (!email) {
    throw new Error("Supabase user is missing an email address");
  }

  const name = getSupabaseAuthUserName(user);
  const emailVerified = getConfirmedAt(user);

  const existingBySupabaseId = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
  });

  if (existingBySupabaseId) {
    return prisma.user.update({
      where: { id: existingBySupabaseId.id },
      data: {
        email,
        emailVerified: emailVerified ?? existingBySupabaseId.emailVerified,
        name: existingBySupabaseId.name ?? name ?? undefined,
      },
    });
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        supabaseUserId: user.id,
        emailVerified: emailVerified ?? existingByEmail.emailVerified,
        name: existingByEmail.name ?? name ?? undefined,
      },
    });
  }

  return prisma.user.create({
    data: {
      supabaseUserId: user.id,
      email,
      emailVerified,
      name,
    },
  });
}
