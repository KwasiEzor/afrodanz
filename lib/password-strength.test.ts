import { describe, expect, it } from 'vitest';
import {
  evaluatePasswordStrength,
  isPasswordStrongEnough,
} from '@/lib/password-strength';

describe('password strength', () => {
  it('flags weak passwords', () => {
    const result = evaluatePasswordStrength('dance');

    expect(result.checks.length).toBe(false);
    expect(result.checks.uppercase).toBe(false);
    expect(result.checks.number).toBe(false);
    expect(isPasswordStrongEnough('dance')).toBe(false);
  });

  it('accepts strong passwords', () => {
    const result = evaluatePasswordStrength('Rhythm123!');

    expect(result.label).toBe('Excellent');
    expect(result.checks.length).toBe(true);
    expect(result.checks.lowercase).toBe(true);
    expect(result.checks.uppercase).toBe(true);
    expect(result.checks.number).toBe(true);
    expect(result.checks.symbol).toBe(true);
    expect(isPasswordStrongEnough('Rhythm123!')).toBe(true);
  });
});
