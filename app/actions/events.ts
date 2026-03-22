'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function createEvent(formData: FormData) {
  await checkAdmin();

  const title = formData.get('title') as string;
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 7);

  const description = formData.get('description') as string;
  const date = new Date(formData.get('date') as string);
  const location = formData.get('location') as string;
  const price = Math.round(parseFloat(formData.get('price') as string) * 100); // Store in cents
  const capacity = parseInt(formData.get('capacity') as string);
  const category = formData.get('category') as string;
  const image = formData.get('image') as string || null;

  try {
    await prisma.event.create({
      data: {
        title,
        slug,
        description,
        date,
        location,
        price,
        capacity,
        category,
        image,
      },
    });

    revalidatePath('/admin/dashboard');
    revalidatePath('/events');
    return { success: true };
  } catch (error) {
    console.error('Failed to create event:', error);
    return { success: false, error: 'Database error' };
  }
}

export async function updateEvent(id: string, formData: FormData) {
  await checkAdmin();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = new Date(formData.get('date') as string);
  const location = formData.get('location') as string;
  const price = Math.round(parseFloat(formData.get('price') as string) * 100);
  const capacity = parseInt(formData.get('capacity') as string);
  const category = formData.get('category') as string;
  const image = formData.get('image') as string || null;

  try {
    await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date,
        location,
        price,
        capacity,
        category,
        image,
      },
    });

    revalidatePath('/admin/dashboard');
    revalidatePath('/events');
    revalidatePath(`/events/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update event:', error);
    return { success: false, error: 'Database error' };
  }
}

export async function deleteEvent(id: string) {
  await checkAdmin();

  try {
    await prisma.event.delete({
      where: { id },
    });

    revalidatePath('/admin/dashboard');
    revalidatePath('/events');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete event:', error);
    return { success: false, error: 'Database error' };
  }
}
