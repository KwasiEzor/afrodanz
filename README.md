# AfroDanz

AfroDanz is a Next.js 16 studio platform for public event discovery, Stripe-backed bookings, memberships, and member/admin dashboards.

## Stack

- Next.js 16 App Router
- Prisma 7 with Postgres
- Auth.js / NextAuth v5 beta
- Stripe Checkout + webhooks
- Vitest + Testing Library

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with the required values:

```bash
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

3. Push the Prisma schema and seed sample data:

```bash
npm run db:push
npm run db:seed
```

4. Start the app:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test -- --run
npx tsc --noEmit
npm run db:push
npm run db:seed
```

## Notes

- `build` uses `next build --webpack`.
  The current Turbopack production build path is unstable in this environment when processing CSS.
- Prisma schema operations use `DIRECT_URL`.
- Runtime DB access uses `DATABASE_URL`.
- The app can derive its own URL from Vercel/request headers, but production deployments should still set `NEXT_PUBLIC_APP_URL`.

## Deployment

Deployment steps for Vercel + Supabase + Stripe are documented in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Validation

Current working validation gate:

```bash
npm run lint
npx tsc --noEmit
npm test -- --run
npm run build
```
