'use client';

import { useActionState, useEffect, useMemo, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Github, Loader2, LockKeyhole, Mail, Sparkles, User2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import {
  credentialsSignInSchema,
} from '@/lib/auth-validation';
import {
  authErrorCodes,
} from '@/lib/auth-errors';
import {
  evaluatePasswordStrength,
} from '@/lib/password-strength';
import {
  registerWithEmailPassword,
} from './actions';
import { initialRegisterActionState } from './action-state';

type OAuthProvider = {
  id: string;
  label: string;
};

type AuthExperienceProps = {
  emailAuthEnabled: boolean;
  oauthProviders: OAuthProvider[];
};

type AuthMode = 'signin' | 'signup';

const formPanelTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as const,
};

const passwordStrengthClasses = [
  'bg-white/10',
  'bg-rose-500/80',
  'bg-orange-500/80',
  'bg-amber-400/90',
  'bg-emerald-400/90',
] as const;

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function inputClassName(hasError: boolean) {
  return [
    'w-full rounded-2xl border bg-black/20 px-4 py-3 text-sm text-white outline-none transition',
    hasError
      ? 'border-rose-400/60 focus:border-rose-300'
      : 'border-white/10 focus:border-primary/60',
  ].join(' ');
}

export function AuthExperience({
  emailAuthEnabled,
  oauthProviders,
}: AuthExperienceProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerState, registerAction, registerPending] = useActionState(
    registerWithEmailPassword,
    initialRegisterActionState
  );
  const [isLoginPending, startLoginTransition] = useTransition();
  const [passwordValue, setPasswordValue] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signupStrength = useMemo(
    () => evaluatePasswordStrength(passwordValue),
    [passwordValue]
  );

  useEffect(() => {
    if (registerState.status === 'success' && registerState.message) {
      toast.success(registerState.message);
    }

    if (registerState.status === 'error' && registerState.message) {
      toast.error(registerState.message);
    }
  }, [registerState]);

  async function handleCredentialsLogin(formData: FormData) {
    setLoginError(null);

    const parsed = credentialsSignInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setLoginError(
        fieldErrors.email?.[0] ??
          fieldErrors.password?.[0] ??
          'Enter your email and password.'
      );
      return;
    }

    startLoginTransition(async () => {
      const result = await signIn('credentials', {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.ok && result.url) {
        window.location.href = result.url;
        return;
      }

      if (result?.code === authErrorCodes.emailNotVerified) {
        setLoginError('Confirm your email from the Supabase verification email before signing in.');
        return;
      }

      if (result?.code === authErrorCodes.authUnavailable) {
        setLoginError('Email sign-in is temporarily unavailable. Check the server configuration.');
        return;
      }

      setLoginError('Your email or password is incorrect.');
    });
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto grid min-h-screen max-w-[1440px] gap-10 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-black/25 p-8 lg:p-12">
          <div className="absolute inset-0">
            <Image
              src="/page_facbook_kouami_atelier_danse_africaine.jpg"
              alt="AfroDanz studio session"
              fill
              className="object-cover opacity-55"
              priority
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(240,150,51,0.18),transparent_46%),linear-gradient(180deg,rgba(7,6,5,0.12),rgba(7,6,5,0.84))]" />
            <div className="absolute inset-0 cinematic-overlay" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="max-w-xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.32em] text-white/70">
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
                AfroDanz Member Access
              </p>
              <h1 className="site-title max-w-lg text-4xl font-black uppercase leading-[0.92] text-white md:text-[3.35rem]">
                Step Into The Studio With A Secure Member Account
              </h1>
              <p className="mt-6 max-w-md text-sm leading-7 text-slate-200/88 md:text-base">
                Create your account with verified email access, manage your bookings,
                and keep your dance journey in one place.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="site-panel-soft rounded-[1.6rem] p-5">
                <Mail className="h-5 w-5 text-secondary" />
                <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-white">
                  Verified Email
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Supabase confirms ownership before account access is granted.
                </p>
              </div>
              <div className="site-panel-soft rounded-[1.6rem] p-5">
                <LockKeyhole className="h-5 w-5 text-secondary" />
                <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-white">
                  Strong Passwords
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Password strength is checked before registration is accepted.
                </p>
              </div>
              <div className="site-panel-soft rounded-[1.6rem] p-5">
                <User2 className="h-5 w-5 text-secondary" />
                <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-white">
                  Member Dashboard
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Book classes, review payments, and keep your profile current.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            layout
            className="site-panel mx-auto w-full max-w-xl rounded-[2rem] p-6 md:p-8"
          >
            <div className="mb-8 flex gap-2 rounded-full border border-white/8 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.22em] transition ${
                  mode === 'signin'
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.22em] transition ${
                  mode === 'signup'
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {mode === 'signin' ? (
                  <motion.div
                    key="signin"
                    layout
                    initial={{ opacity: 0, x: -18, y: 10, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: 18, y: -6, filter: 'blur(8px)' }}
                    transition={formPanelTransition}
                  >
                    <div className="mb-8">
                      <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                        Member Sign In
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        Use your verified email address and password to enter the portal.
                      </p>
                    </div>

                    {emailAuthEnabled ? (
                      <form action={handleCredentialsLogin} className="space-y-4">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-muted">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            className={inputClassName(Boolean(loginError))}
                            placeholder="you@example.com"
                          />
                        </div>
                        <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-muted">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          name="password"
                          autoComplete="current-password"
                          className={`${inputClassName(Boolean(loginError))} pr-14`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword((current) => !current)}
                          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted transition hover:text-white"
                          aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                        {loginError ? (
                          <div className="flex items-start gap-3 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{loginError}</span>
                          </div>
                        ) : null}

                        <button
                          type="submit"
                          className="site-primary-button flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold text-white"
                          disabled={isLoginPending}
                        >
                          {isLoginPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                          {isLoginPending ? 'Signing In...' : 'Sign In Securely'}
                        </button>
                      </form>
                    ) : (
                      <div className="rounded-[1.6rem] border border-amber-400/20 bg-amber-500/8 p-5 text-sm leading-6 text-slate-200">
                        Email sign-in is not configured on the server yet.
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    layout
                    initial={{ opacity: 0, x: 18, y: 10, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -18, y: -6, filter: 'blur(8px)' }}
                    transition={formPanelTransition}
                  >
                    <div className="mb-8">
                      <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                        Create Your Account
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        Register with Supabase email confirmation before your first sign-in.
                      </p>
                    </div>

                    {emailAuthEnabled ? (
                      <form action={registerAction} className="space-y-4">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-muted">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            autoComplete="name"
                            className={inputClassName(Boolean(registerState.fieldErrors?.name?.length))}
                            placeholder="Your name"
                          />
                          {registerState.fieldErrors?.name?.[0] ? (
                            <p className="mt-2 text-sm text-rose-200">
                              {registerState.fieldErrors.name[0]}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-muted">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            className={inputClassName(Boolean(registerState.fieldErrors?.email?.length))}
                            placeholder="you@example.com"
                          />
                          {registerState.fieldErrors?.email?.[0] ? (
                            <p className="mt-2 text-sm text-rose-200">
                              {registerState.fieldErrors.email[0]}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-muted">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showSignupPassword ? 'text' : 'password'}
                              name="password"
                              autoComplete="new-password"
                              className={`${inputClassName(Boolean(registerState.fieldErrors?.password?.length))} pr-14`}
                              placeholder="Create a strong password"
                              value={passwordValue ?? ''}
                              onChange={(event) => setPasswordValue(event.currentTarget.value ?? '')}
                            />
                            <button
                              type="button"
                              onClick={() => setShowSignupPassword((current) => !current)}
                              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted transition hover:text-white"
                              aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                            >
                              {showSignupPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          <div className="mt-3 grid grid-cols-4 gap-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                              <div
                                key={index}
                                className={`h-1.5 rounded-full ${
                                  signupStrength.score >= index + 1
                                    ? passwordStrengthClasses[signupStrength.score]
                                    : 'bg-white/10'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted">
                            <span>Password strength</span>
                            <span>{passwordValue ? signupStrength.label : 'Waiting for input'}</span>
                          </div>
                          <div className="mt-3 grid gap-2 text-xs leading-5 text-slate-300 md:grid-cols-2">
                            <span>{signupStrength.checks.length ? 'OK' : 'Need'} 8+ characters</span>
                            <span>{signupStrength.checks.uppercase ? 'OK' : 'Need'} uppercase letter</span>
                            <span>{signupStrength.checks.lowercase ? 'OK' : 'Need'} lowercase letter</span>
                            <span>{signupStrength.checks.number ? 'OK' : 'Need'} number</span>
                            <span className="md:col-span-2">
                              {signupStrength.checks.symbol || passwordValue.length >= 12 ? 'OK' : 'Need'} symbol or 12+ characters
                            </span>
                          </div>
                          {registerState.fieldErrors?.password?.[0] ? (
                            <p className="mt-2 text-sm text-rose-200">
                              {registerState.fieldErrors.password[0]}
                            </p>
                          ) : null}
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-muted">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              autoComplete="new-password"
                              className={`${inputClassName(Boolean(registerState.fieldErrors?.confirmPassword?.length))} pr-14`}
                              placeholder="Repeat your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((current) => !current)}
                              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted transition hover:text-white"
                              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          {registerState.fieldErrors?.confirmPassword?.[0] ? (
                            <p className="mt-2 text-sm text-rose-200">
                              {registerState.fieldErrors.confirmPassword[0]}
                            </p>
                          ) : null}
                        </div>

                        {registerState.status === 'success' && registerState.message ? (
                          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                              <span>{registerState.message}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setMode('signin')}
                              className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-white"
                            >
                              Go To Sign In
                            </button>
                          </div>
                        ) : null}

                        <button
                          type="submit"
                          className="site-primary-button flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-bold text-white"
                          disabled={registerPending}
                        >
                          {registerPending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                          {registerPending ? 'Creating Account...' : 'Register With Email'}
                        </button>
                      </form>
                    ) : (
                      <div className="rounded-[1.6rem] border border-amber-400/20 bg-amber-500/8 p-5 text-sm leading-6 text-slate-200">
                        Email registration is not configured on the server yet.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {oauthProviders.length > 0 ? (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[var(--panel)] px-4 text-[0.68rem] font-bold uppercase tracking-[0.32em] text-muted">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {oauthProviders.map((provider) => (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
                      className={`flex w-full items-center justify-center gap-4 rounded-2xl py-4 font-bold text-white ${
                        provider.id === 'github'
                          ? 'site-primary-button'
                          : 'site-panel-soft hover:bg-white/8'
                      }`}
                    >
                      {provider.id === 'google' ? <GoogleIcon /> : null}
                      {provider.id === 'github' ? <Github className="h-5 w-5" /> : null}
                      {provider.label}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            <p className="mt-8 text-center text-sm leading-6 text-muted">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="font-bold text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-bold text-primary">
                Privacy Policy
              </Link>
              .
            </p>

            <div className="mt-6 flex justify-center">
              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-muted transition hover:border-primary/40 hover:text-white"
              >
                Back To Homepage
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
