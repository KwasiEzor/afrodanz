import type { Metadata } from 'next';
import { AuthExperience } from './AuthExperience';
import { authProviderAvailability } from '@/lib/auth.config';

export const metadata: Metadata = {
  title: 'Sign In | AfroDanz',
  description: 'Sign in or create your AfroDanz member account to book workshops and manage your dance journey.',
};

export default function LoginPage() {
  const oauthProviders: { id: string; labelKey: string }[] = [];

  if (authProviderAvailability.google) {
    oauthProviders.push({ id: 'google', labelKey: 'auth.continueWithGoogle' });
  }

  if (authProviderAvailability.github) {
    oauthProviders.push({ id: 'github', labelKey: 'auth.continueWithGithub' });
  }

  return (
    <AuthExperience
      emailAuthEnabled={authProviderAvailability.credentials}
      oauthProviders={oauthProviders}
    />
  );
}
