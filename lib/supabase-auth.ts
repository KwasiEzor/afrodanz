import { createClient } from "@supabase/supabase-js";
import type { User as SupabaseUser } from "@supabase/supabase-js";

function getSupabaseAuthUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getSupabaseAuthKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  );
}

export const isSupabaseAuthConfigured = Boolean(
  getSupabaseAuthUrl() && getSupabaseAuthKey()
);

function getRequiredSupabaseAuthConfig() {
  const url = getSupabaseAuthUrl();
  const key = getSupabaseAuthKey();

  if (!url || !key) {
    throw new Error("Supabase Auth is not configured");
  }

  return { url, key };
}

function createSupabaseAuthClient() {
  const { url, key } = getRequiredSupabaseAuthConfig();

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export async function signUpWithSupabaseEmailPassword(input: {
  name: string;
  email: string;
  password: string;
  emailRedirectTo: string;
}) {
  const supabase = createSupabaseAuthClient();

  const response = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: input.emailRedirectTo,
      data: {
        name: input.name,
      },
    },
  });

  return response;
}

export async function signInWithSupabaseEmailPassword(input: {
  email: string;
  password: string;
}) {
  const supabase = createSupabaseAuthClient();

  const response = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  return response;
}

export function getSupabaseAuthUserName(user: SupabaseUser) {
  const metadataName = user.user_metadata.name;

  return typeof metadataName === "string" && metadataName.trim().length > 0
    ? metadataName.trim()
    : null;
}

export function isSupabaseEmailNotConfirmedError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("email not confirmed") ||
    message.includes("email_not_confirmed")
  );
}

export function isSupabaseInvalidCredentialsError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("invalid login credentials") ||
    message.includes("invalid_credentials") ||
    message.includes("invalid email or password")
  );
}
