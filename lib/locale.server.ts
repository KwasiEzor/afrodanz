import { cookies } from 'next/headers';
import { COOKIE_NAME } from './locale.constants';
import { defaultLocale, isSupportedLocale } from './i18n';

export async function getServerLocale() {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (isSupportedLocale(cookie)) {
    return cookie;
  }
  return defaultLocale;
}
