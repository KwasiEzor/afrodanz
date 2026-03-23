import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DIRECT_URL / DATABASE_URL for seeding.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function daysFromNow(days, hour = 18, minute = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
}

const imagePath = "/page_facbook_kouami_atelier_danse_africaine.jpg";

const users = [
  {
    id: "seed_admin_kouami",
    email: "kouami@afrodanz.com",
    name: "Kouami N'Dri",
    role: "ADMIN",
    image: imagePath,
    subscriptionStatus: "ACTIVE",
  },
  {
    id: "seed_member_lea",
    email: "lea.martin@afrodanz.com",
    name: "Lea Martin",
    role: "MEMBER",
    image: imagePath,
    subscriptionStatus: "ACTIVE",
  },
  {
    id: "seed_member_idriss",
    email: "idriss.sow@afrodanz.com",
    name: "Idriss Sow",
    role: "MEMBER",
    image: imagePath,
    subscriptionStatus: "PAST_DUE",
  },
  {
    id: "seed_member_amina",
    email: "amina.diop@afrodanz.com",
    name: "Amina Diop",
    role: "MEMBER",
    image: imagePath,
    subscriptionStatus: null,
  },
];

const events = [
  {
    id: "seed_event_amapiano_foundations",
    slug: "amapiano-foundations-live",
    title: "Amapiano Foundations",
    description:
      "A high-energy beginner-friendly workshop focused on groove, bounce, musicality, and clean transitions.",
    date: daysFromNow(6, 18, 30),
    location: "Main Studio, Paris",
    price: 2500,
    capacity: 24,
    category: "Workshop",
    image: imagePath,
  },
  {
    id: "seed_event_afrobeats_lab",
    slug: "afrobeats-choreo-lab",
    title: "Afrobeats Choreo Lab",
    description:
      "Learn a full-performance combination with coached breakdowns, texture drills, and partner energy work.",
    date: daysFromNow(12, 19, 0),
    location: "Main Studio, Paris",
    price: 3000,
    capacity: 28,
    category: "Class",
    image: imagePath,
  },
  {
    id: "seed_event_afro_fusion_intensive",
    slug: "afro-fusion-sunday-intensive",
    title: "Afro Fusion Sunday Intensive",
    description:
      "A longer-format intensive for dancers ready to blend footwork, expression, and endurance across styles.",
    date: daysFromNow(18, 10, 30),
    location: "Outdoor Arena, Paris",
    price: 4500,
    capacity: 20,
    category: "Intensive",
    image: imagePath,
  },
  {
    id: "seed_event_contemporary_roots",
    slug: "contemporary-roots-lab",
    title: "Contemporary Roots Lab",
    description:
      "Explore grounded afro-contemporary movement with musical interpretation and guided improvisation.",
    date: daysFromNow(-9, 18, 0),
    location: "Creative Room, Paris",
    price: 2200,
    capacity: 18,
    category: "Workshop",
    image: imagePath,
  },
  {
    id: "seed_event_community_jam",
    slug: "community-jam-open-session",
    title: "Community Jam Open Session",
    description:
      "A low-pressure social session to practice combos, freestyle, and meet the wider AfroDanz community.",
    date: daysFromNow(3, 20, 0),
    location: "Main Studio, Paris",
    price: 0,
    capacity: 40,
    category: "Class",
    image: imagePath,
  },
];

const bookings = [
  {
    id: "seed_booking_lea_paid",
    userId: "seed_member_lea",
    eventId: "seed_event_amapiano_foundations",
    status: "PAID",
    expiresAt: null,
  },
  {
    id: "seed_booking_idriss_paid",
    userId: "seed_member_idriss",
    eventId: "seed_event_contemporary_roots",
    status: "PAID",
    expiresAt: null,
  },
  {
    id: "seed_booking_amina_pending",
    userId: "seed_member_amina",
    eventId: "seed_event_afrobeats_lab",
    status: "PENDING",
    expiresAt: daysFromNow(0, 23, 59),
  },
  {
    id: "seed_booking_admin_free",
    userId: "seed_admin_kouami",
    eventId: "seed_event_community_jam",
    status: "PAID",
    expiresAt: null,
  },
];

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
        subscriptionStatus: user.subscriptionStatus,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
        subscriptionStatus: user.subscriptionStatus,
      },
    });
  }

  for (const event of events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {
        slug: event.slug,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        price: event.price,
        capacity: event.capacity,
        category: event.category,
        image: event.image,
      },
      create: event,
    });
  }

  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {
        userId: booking.userId,
        eventId: booking.eventId,
        status: booking.status,
        expiresAt: booking.expiresAt,
      },
      create: booking,
    });
  }

  const [userCount, eventCount, bookingCount] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.booking.count(),
  ]);

  console.log(
    JSON.stringify(
      {
        users: userCount,
        events: eventCount,
        bookings: bookingCount,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
