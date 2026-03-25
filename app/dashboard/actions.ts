'use server';

import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { signInWithSupabaseEmailPassword } from '@/lib/supabase-auth';
import { isPasswordStrongEnough } from '@/lib/password-strength';

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: 'not_authenticated' as const };
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'missing_fields' as const };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'mismatch' as const };
  }

  if (!isPasswordStrongEnough(newPassword)) {
    return { error: 'too_weak' as const };
  }

  // Verify current password via Supabase sign-in
  const { error: signInError } = await signInWithSupabaseEmailPassword({
    email: session.user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { error: 'invalid_current' as const };
  }

  // Get user's supabaseUserId from Prisma
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { supabaseUserId: true },
  });

  if (!dbUser?.supabaseUserId) {
    return { error: 'update_failed' as const };
  }

  // Update password via Supabase admin API
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { error: 'update_failed' as const };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: updateError } = await supabase.auth.admin.updateUserById(
    dbUser.supabaseUserId,
    { password: newPassword },
  );

  if (updateError) {
    return { error: 'update_failed' as const };
  }

  return { success: true as const };
}
