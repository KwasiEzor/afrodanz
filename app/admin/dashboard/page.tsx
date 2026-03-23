import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminDashboardUI from './AdminDashboardUI';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await auth();

  if (session?.user?.role !== 'ADMIN') {
    redirect('/');
  }

  // Fetch Stats
  const [totalMembers, activeEventsCount, paidBookings] = await Promise.all([
    prisma.user.count(),
    prisma.event.count({
      where: {
        date: {
          gt: new Date(),
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        status: 'PAID',
      },
      include: {
        event: {
          select: {
            price: true,
          },
        },
      },
    }),
  ]);

  const revenue = paidBookings.reduce((acc, booking) => acc + booking.event.price, 0);

  // Fetch Recent Bookings
  const recentBookings = await prisma.booking.findMany({
    take: 50,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      event: {
        select: {
          title: true,
          price: true,
        },
      },
    },
  });

  // Fetch All Events for Management
  const allEvents = await prisma.event.findMany({
    orderBy: {
      date: 'desc',
    },
    include: {
      bookings: {
        where: {
          status: 'PAID',
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      _count: {
        select: {
          bookings: {
            where: {
              status: 'PAID',
            },
          },
        },
      },
    },
  });

  return (
    <AdminDashboardUI 
      stats={{
        totalMembers,
        revenue,
        activeEvents: activeEventsCount,
      }}
      recentBookings={recentBookings}
      allEvents={allEvents}
    />
  );
}
