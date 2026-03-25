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
  const [totalMembers, activeEventsCount, revenueResult] = await Promise.all([
    prisma.user.count({
      where: {
        role: 'MEMBER',
      },
    }),
    prisma.event.count({
      where: {
        date: {
          gt: new Date(),
        },
      },
    }),
    prisma.$queryRaw<[{ total: bigint | null }]>`
      SELECT COALESCE(SUM(e.price), 0) AS total
      FROM "Booking" b
      JOIN "Event" e ON e.id = b."eventId"
      WHERE b.status = 'PAID'
    `,
  ]);

  const revenue = Number(revenueResult[0]?.total ?? 0);

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

  // Fetch Events for Management (paginated)
  const allEvents = await prisma.event.findMany({
    take: 50,
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
