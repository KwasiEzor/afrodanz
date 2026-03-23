import { AuthExperience } from './AuthExperience';
import { authProviderAvailability } from '@/lib/auth.config';

export default function LoginPage() {
  const oauthProviders: { id: string; label: string }[] = [];

  if (authProviderAvailability.google) {
    oauthProviders.push({ id: 'google', label: 'Continue with Google' });
  }

  if (authProviderAvailability.github) {
    oauthProviders.push({ id: 'github', label: 'Continue with GitHub' });
  }

  return (
    <AuthExperience
      emailAuthEnabled={authProviderAvailability.credentials}
      oauthProviders={oauthProviders}
    />
  );
}
