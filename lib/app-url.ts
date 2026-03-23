import { headers } from 'next/headers';

function normalizeTrailingSlash(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function toAbsoluteUrl(rawUrl: string, envName: string) {
  try {
    return normalizeTrailingSlash(new URL(rawUrl).toString());
  } catch {
    throw new Error(`${envName} must be a valid absolute URL`);
  }
}

function resolveConfiguredAppUrl() {
  const candidates = [
    ['NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_APP_URL],
    ['AUTH_URL', process.env.AUTH_URL],
    ['NEXTAUTH_URL', process.env.NEXTAUTH_URL],
    [
      'VERCEL_PROJECT_PRODUCTION_URL',
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : undefined,
    ],
    [
      'VERCEL_URL',
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    ],
  ] as const;

  for (const [envName, rawUrl] of candidates) {
    if (rawUrl) {
      return toAbsoluteUrl(rawUrl, envName);
    }
  }

  return null;
}

async function resolveRequestAppUrl() {
  try {
    const requestHeaders = await headers();
    const origin = requestHeaders.get('origin');

    if (origin) {
      return toAbsoluteUrl(origin, 'origin header');
    }

    const host =
      requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');

    if (!host) {
      return null;
    }

    const protocol =
      requestHeaders.get('x-forwarded-proto') ??
      (process.env.NODE_ENV === 'production' ? 'https' : 'http');

    return toAbsoluteUrl(`${protocol}://${host}`, 'request host');
  } catch {
    return null;
  }
}

export async function getRequiredAppUrl() {
  const configuredUrl = resolveConfiguredAppUrl();

  if (configuredUrl) {
    return configuredUrl;
  }

  const requestUrl = await resolveRequestAppUrl();

  if (requestUrl) {
    return requestUrl;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  throw new Error('App URL could not be resolved. Configure NEXT_PUBLIC_APP_URL.');
}
