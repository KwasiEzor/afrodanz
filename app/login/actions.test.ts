import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  registerWithEmailPassword,
} from './actions';
import { initialRegisterActionState } from './action-state';

vi.mock('@/lib/app-url', () => ({
  getRequiredAppUrl: vi.fn(async () => 'https://afrodanz.test'),
}));

vi.mock('@/lib/supabase-auth', () => ({
  signUpWithSupabaseEmailPassword: vi.fn(),
}));

import { signUpWithSupabaseEmailPassword } from '@/lib/supabase-auth';

describe('registerWithEmailPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns field errors when registration data is invalid', async () => {
    const formData = new FormData();
    formData.set('name', 'A');
    formData.set('email', 'bad-email');
    formData.set('password', 'short');
    formData.set('confirmPassword', 'different');

    const result = await registerWithEmailPassword(
      initialRegisterActionState,
      formData
    );

    expect(result.status).toBe('error');
    expect(result.fieldErrors?.name?.[0]).toBeDefined();
    expect(result.fieldErrors?.email?.[0]).toBeDefined();
    expect(result.fieldErrors?.password?.[0]).toBeDefined();
    expect(result.fieldErrors?.confirmPassword?.[0]).toBeDefined();
    expect(signUpWithSupabaseEmailPassword).not.toHaveBeenCalled();
  });

  it('returns a verification message after successful sign-up', async () => {
    vi.mocked(signUpWithSupabaseEmailPassword).mockResolvedValue(
      {
        data: {
          user: { id: 'supabase-user-1' } as Awaited<
            ReturnType<typeof signUpWithSupabaseEmailPassword>
          >['data']['user'],
          session: null,
        },
        error: null,
      } as Awaited<ReturnType<typeof signUpWithSupabaseEmailPassword>>
    );

    const formData = new FormData();
    formData.set('name', 'Amina Kouame');
    formData.set('email', 'amina@example.com');
    formData.set('password', 'Rhythm123!');
    formData.set('confirmPassword', 'Rhythm123!');

    const result = await registerWithEmailPassword(
      initialRegisterActionState,
      formData
    );

    expect(signUpWithSupabaseEmailPassword).toHaveBeenCalledWith({
      name: 'Amina Kouame',
      email: 'amina@example.com',
      password: 'Rhythm123!',
      emailRedirectTo: 'https://afrodanz.test/login',
    });
    expect(result).toEqual({
      status: 'success',
      message: 'Check your inbox and confirm your email before signing in.',
    });
  });

  it('maps duplicate users to a friendly message', async () => {
    vi.mocked(signUpWithSupabaseEmailPassword).mockResolvedValue(
      {
        data: {
          user: null,
          session: null,
        },
        error: {
          message: 'User already registered',
        },
      } as Awaited<ReturnType<typeof signUpWithSupabaseEmailPassword>>
    );

    const formData = new FormData();
    formData.set('name', 'Amina Kouame');
    formData.set('email', 'amina@example.com');
    formData.set('password', 'Rhythm123!');
    formData.set('confirmPassword', 'Rhythm123!');

    const result = await registerWithEmailPassword(
      initialRegisterActionState,
      formData
    );

    expect(result).toEqual({
      status: 'error',
      message: 'That email is already registered. Sign in instead.',
    });
  });
});
