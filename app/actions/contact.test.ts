import { describe, it, expect } from 'vitest';
import { sendContactMessage } from './contact';

function makeFormData(overrides: Record<string, string> = {}) {
  const defaults: Record<string, string> = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    message: 'Hello, I would like more info about your workshops.',
  };
  const fd = new FormData();
  for (const [key, value] of Object.entries({ ...defaults, ...overrides })) {
    fd.append(key, value);
  }
  return fd;
}

describe('sendContactMessage', () => {
  it('should succeed with valid input', async () => {
    const result = await sendContactMessage(makeFormData());
    expect(result).toEqual({ success: true });
  });

  it('should reject missing first name', async () => {
    const result = await sendContactMessage(makeFormData({ firstName: '' }));
    expect(result.success).toBe(false);
    expect(result).toHaveProperty('error');
  });

  it('should reject invalid email', async () => {
    const result = await sendContactMessage(makeFormData({ email: 'not-an-email' }));
    expect(result.success).toBe(false);
    expect(result).toHaveProperty('error');
  });

  it('should reject message shorter than 10 characters', async () => {
    const result = await sendContactMessage(makeFormData({ message: 'Hi' }));
    expect(result.success).toBe(false);
    expect(result).toHaveProperty('error');
  });

  it('should reject message longer than 5000 characters', async () => {
    const result = await sendContactMessage(makeFormData({ message: 'a'.repeat(5001) }));
    expect(result.success).toBe(false);
    expect(result).toHaveProperty('error');
  });
});
