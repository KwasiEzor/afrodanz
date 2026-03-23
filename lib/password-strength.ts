export const MIN_PASSWORD_LENGTH = 8;

const PASSWORD_LABELS = ["Very weak", "Weak", "Fair", "Strong", "Excellent"] as const;

export type PasswordStrengthResult = {
  score: number;
  label: (typeof PASSWORD_LABELS)[number];
  percentage: number;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    symbol: boolean;
  };
};

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    length: password.length >= MIN_PASSWORD_LENGTH,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const satisfiedChecks = Object.values(checks).filter(Boolean).length;
  let score = Math.max(0, satisfiedChecks - 1);

  if (password.length >= 12 && score < 4) {
    score += 1;
  }

  score = Math.min(score, 4);

  return {
    score,
    label: PASSWORD_LABELS[score],
    percentage: (score / 4) * 100,
    checks,
  };
}

export function isPasswordStrongEnough(password: string) {
  const result = evaluatePasswordStrength(password);

  return (
    result.checks.length &&
    result.checks.lowercase &&
    result.checks.uppercase &&
    result.checks.number &&
    (result.checks.symbol || password.length >= 12)
  );
}
