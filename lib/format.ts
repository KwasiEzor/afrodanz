const euroFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'EUR',
});

/** Format a price stored in cents to a display string like "€25.00" */
export function formatPrice(cents: number): string {
  return euroFormatter.format(cents / 100);
}

/** Format a date to short display: "24 Mar 2026" */
export function formatDateShort(date: Date | string, locale = 'en-GB'): string {
  return new Date(date).toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Format a date to long display: "Monday, 24 March" */
export function formatDateLong(date: Date | string, locale = 'en-GB'): string {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** Format time: "20:00" */
export function formatTime(date: Date | string, locale = 'en-GB'): string {
  return new Date(date).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Format a date to short month: "Mar" */
export function formatMonthShort(date: Date | string, locale = 'en-GB'): string {
  return new Date(date).toLocaleDateString(locale, { month: 'short' });
}

/** Format a date to just day/month/year: "24/03/2026" */
export function formatDateCompact(date: Date | string, locale = 'en-GB'): string {
  return new Date(date).toLocaleDateString(locale);
}
