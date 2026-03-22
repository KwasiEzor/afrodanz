'use server';

export async function sendContactMessage(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // In a real app, you would send this to an email service like Resend, SendGrid, etc.
  console.log('Contact Message Received:', { firstName, lastName, email, message });

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true };
}
