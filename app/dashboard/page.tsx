import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import DashboardUI from './DashboardUI';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard | AfroDanz',
  description: 'Manage your AfroDanz bookings, memberships, and account settings.',
};

export default async function MemberDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userWithBookings = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      bookings: {
        where: {
          status: 'PAID'
        },
        include: {
          event: true
        },
        orderBy: {
          event: {
            date: 'asc'
          }
        }
      }
    }
  });

  if (!userWithBookings) {
    redirect('/');
  }

  return (
    <DashboardUI 
      user={session.user} 
      bookings={userWithBookings.bookings} 
    />
  );
}
