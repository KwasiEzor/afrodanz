'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const EventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  date: z.coerce.date(),
  location: z.string().min(2, "Location is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  category: z.enum(['Workshop', 'Class', 'Intensive']),
  image: z.string().url().optional().or(z.literal('')),
});

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function createEvent(formData: FormData) {
  await checkAdmin();

  const rawData = Object.fromEntries(formData.entries());
  const validated = EventSchema.safeParse(rawData);

  if (!validated.success) {
    return { 
      success: false, 
      error: "Validation failed",
      fields: validated.error.flatten().fieldErrors
    };
  }

  const { title, description, date, location, price, capacity, category, image } = validated.data;
  
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 7);

  const priceInCents = Math.round(price * 100);

  try {
    await prisma.event.create({
      data: {
        title,
        slug,
        description,
        date,
        location,
        price: priceInCents,
        capacity,
        category,
        image: image || null,
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

  const rawData = Object.fromEntries(formData.entries());
  const validated = EventSchema.safeParse(rawData);

  if (!validated.success) {
    return { 
      success: false, 
      error: "Validation failed",
      fields: validated.error.flatten().fieldErrors
    };
  }

  const { title, description, date, location, price, capacity, category, image } = validated.data;
  const priceInCents = Math.round(price * 100);

  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date,
        location,
        price: priceInCents,
        capacity,
        category,
        image: image || null,
      },
    });

    revalidatePath('/admin/dashboard');
    revalidatePath('/events');
    revalidatePath(`/events/${updatedEvent.slug}`); // Fix: Use slug instead of ID for revalidation
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
