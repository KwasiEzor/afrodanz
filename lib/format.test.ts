import { describe, it, expect } from 'vitest';
import { formatPrice, formatDateShort, formatDateLong, formatTime, formatMonthShort, formatDateCompact } from './format';

describe('formatPrice', () => {
  it('formats cents to EUR string', () => {
    expect(formatPrice(2500)).toBe('€25.00');
  });

  it('formats zero price', () => {
    expect(formatPrice(0)).toBe('€0.00');
  });

  it('formats sub-euro amounts', () => {
    expect(formatPrice(99)).toBe('€0.99');
  });
});

describe('formatDateShort', () => {
  it('formats a date string', () => {
    const result = formatDateShort('2026-03-24T20:00:00Z');
    expect(result).toMatch(/24/);
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/2026/);
  });

  it('formats a Date object', () => {
    const result = formatDateShort(new Date('2026-12-01'));
    expect(result).toMatch(/Dec/);
  });
});

describe('formatDateLong', () => {
  it('includes weekday and month', () => {
    const result = formatDateLong('2026-03-24T10:00:00Z');
    expect(result).toMatch(/24/);
    expect(result).toMatch(/March/);
  });
});

describe('formatTime', () => {
  it('formats hours and minutes', () => {
    const result = formatTime('2026-03-24T20:00:00Z');
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});

describe('formatMonthShort', () => {
  it('returns short month name', () => {
    expect(formatMonthShort('2026-03-24')).toMatch(/Mar/);
  });
});

describe('formatDateCompact', () => {
  it('returns compact date', () => {
    const result = formatDateCompact('2026-03-24');
    expect(result).toMatch(/2026/);
  });
});
