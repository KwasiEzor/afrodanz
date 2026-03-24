'use server';

import { z } from 'zod';

const ContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Use a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export async function sendContactMessage(formData: FormData) {
  const parsed = ContactSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { firstName, lastName, email, message } = parsed.data;

  // In a real app, you would send this to an email service like Resend, SendGrid, etc.
  console.log('Contact Message Received:', { firstName, lastName, email, message });

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}
