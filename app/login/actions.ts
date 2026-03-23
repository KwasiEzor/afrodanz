'use server';

import { getRequiredAppUrl } from '@/lib/app-url';
import { emailRegistrationSchema } from '@/lib/auth-validation';
import { signUpWithSupabaseEmailPassword } from '@/lib/supabase-auth';
import type { RegisterActionState } from './action-state';

export async function registerWithEmailPassword(
  _previousState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  const parsed = emailRegistrationSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Fix the highlighted fields and try again.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const appUrl = await getRequiredAppUrl();

    const response = await signUpWithSupabaseEmailPassword({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      emailRedirectTo: `${appUrl}/login`,
    });

    if (response.error) {
      return {
        status: 'error',
        message:
          response.error.message === 'User already registered'
            ? 'That email is already registered. Sign in instead.'
            : response.error.message,
      };
    }

    return {
      status: 'success',
      message:
        'Check your inbox and confirm your email before signing in.',
    };
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Registration is unavailable right now. Please try again.',
    };
  }
}
