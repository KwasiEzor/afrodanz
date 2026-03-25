'use client';

import dynamic from 'next/dynamic';

const CookieBanner = dynamic(
  () => import('./CookieBanner').then(m => ({ default: m.CookieBanner })),
  { ssr: false }
);

export function LazyCookieBanner() {
  return <CookieBanner />;
}
