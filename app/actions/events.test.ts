import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createEvent } from './events';
import { auth } from '@/lib/auth';

describe('createEvent Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fail if user is not an admin', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { role: 'MEMBER' },
    } as Awaited<ReturnType<typeof auth>>);
    
    const formData = new FormData();
    formData.append('title', 'Test Event');

    await expect(createEvent(formData)).rejects.toThrow('Unauthorized');
  });

  it('should fail if price is negative', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { role: 'ADMIN' },
    } as Awaited<ReturnType<typeof auth>>);
    
    const formData = new FormData();
    formData.append('title', 'Test Event');
    formData.append('price', '-10');
    formData.append('capacity', '20');
    formData.append('date', '2026-03-22T10:00');
    formData.append('category', 'Workshop');
    formData.append('location', 'Studio');

    const result = await createEvent(formData);
    expect(result.success).toBe(false);
    expect(result.fields?.price).toContain('Price must be positive');
  });

  it('should fail if capacity is negative or zero', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { role: 'ADMIN' },
    } as Awaited<ReturnType<typeof auth>>);
    
    const formData = new FormData();
    formData.append('title', 'Test Event');
    formData.append('price', '25');
    formData.append('capacity', '0');
    formData.append('date', '2026-03-22T10:00');
    formData.append('category', 'Workshop');
    formData.append('location', 'Studio');

    const result = await createEvent(formData);
    expect(result.success).toBe(false);
    expect(result.fields?.capacity).toContain('Capacity must be at least 1');
  });
});
