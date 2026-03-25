export type CookieCategories = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

export type CookieConsent = {
  version: 1;
  categories: CookieCategories;
  updatedAt: string;
};

const STORAGE_KEY = 'afrodanz_cookie_consent';
const COOKIE_NAME = 'afrodanz_cookie_consent';

function now() {
  return new Date().toISOString();
}

const DEFAULT_CONSENT: CookieConsent = {
  version: 1,
  categories: {
    essential: true,
    analytics: false,
    marketing: false,
  },
  updatedAt: now(),
};

function writeToStorage(consent: CookieConsent) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
      JSON.stringify(consent)
    )}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  } catch (error) {
    console.error('Unable to save cookie consent', error);
  }
}

function readFromStorage(): CookieConsent | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as CookieConsent;
    } catch {
      return null;
    }
  }

  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));

  if (match) {
    const value = match.split('=')[1];
    try {
      return JSON.parse(decodeURIComponent(value)) as CookieConsent;
    } catch {
      return null;
    }
  }

  return null;
}

export function getConsent() {
  return readFromStorage();
}

export function persistConsent(consent: CookieConsent) {
  writeToStorage(consent);
}

export function acceptAllCookies() {
  const consent: CookieConsent = {
    version: 1,
    updatedAt: now(),
    categories: {
      essential: true,
      analytics: true,
      marketing: true,
    },
  };

  persistConsent(consent);
  return consent;
}

export function savePreferences(categories: Partial<CookieCategories>) {
  const existing = getConsent() ?? DEFAULT_CONSENT;
  const next: CookieConsent = {
    ...existing,
    updatedAt: now(),
    categories: {
      essential: true,
      analytics: categories.analytics ?? existing.categories.analytics,
      marketing: categories.marketing ?? existing.categories.marketing,
    },
  };

  persistConsent(next);
  return next;
}
