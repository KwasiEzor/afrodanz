import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock @prisma/client enums
vi.mock('@prisma/client', () => ({
  BookingStatus: {
    PENDING: 'PENDING',
    PAID: 'PAID',
    CANCELED: 'CANCELED',
  },
  SubscriptionStatus: {
    ACTIVE: 'ACTIVE',
    PAST_DUE: 'PAST_DUE',
    CANCELED: 'CANCELED',
    INCOMPLETE: 'INCOMPLETE',
  },
  Role: {
    MEMBER: 'MEMBER',
    ADMIN: 'ADMIN',
  }
}))

const prismaMock = {
  $transaction: vi.fn((cb) => cb(prismaMock)),
  event: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  booking: {
    create: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  user: {
    update: vi.fn(),
    count: vi.fn(),
  }
}

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: prismaMock,
}))

// Mock Auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

// Mock Next Cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock Next Headers
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: vi.fn((name: string) =>
      name === 'Stripe-Signature' ? 'test_sig' : null
    ),
  })),
}))
