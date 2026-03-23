# AfroDanz Deployment

This project is intended to run on Vercel with:

- Vercel for hosting
- Supabase Postgres + Supabase Auth
- Stripe Checkout + Stripe webhooks

## 1. Vercel Project

Create a Vercel project that points to this repository.

Recommended settings:

- Framework preset: `Next.js`
- Node version: leave Vercel default unless your project policy requires pinning
- Install command: `npm install`
- Build command: `npm run build`
- Output command: leave default

## 2. Required Environment Variables

Set these in Vercel for the environment you are deploying (`Production`, and optionally `Preview`).

### Database

```bash
DATABASE_URL=
DIRECT_URL=
```

Notes:

- `DATABASE_URL` is used by the running app.
- `DIRECT_URL` is used for Prisma schema operations and should point to the direct Supabase connection, not the pooler.

### App URL / Auth

```bash
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Optional fallbacks supported by the app:

```bash
AUTH_URL=
NEXTAUTH_URL=
```

Notes:

- `AUTH_SECRET` must be set in Vercel. Do not rely on the local fallback secret outside development.
- `NEXT_PUBLIC_APP_URL` should be your stable deployed URL, for example:
  `https://afrodanz-demo.vercel.app`
- The app can infer the URL from Vercel/request headers, but for production/demo reliability you should still set `NEXT_PUBLIC_APP_URL`.
- If your Supabase project uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, the app can read that too, but `NEXT_PUBLIC_SUPABASE_ANON_KEY` should be the default choice.

### Stripe

```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Use Stripe test keys for demo environments.

### Optional OAuth Providers

```bash
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

These are optional. The app will hide unavailable OAuth providers automatically.

## 3. Supabase Configuration

In Supabase:

1. Confirm the database is the same project referenced by `DATABASE_URL` and `DIRECT_URL`.
2. In Authentication settings, set:
   - Site URL: your stable Vercel URL
   - Additional redirect URLs:
     - `https://your-demo-domain.vercel.app/login`
     - any custom domain login URL if you use one
3. Keep email confirmation enabled if you want registration to require inbox verification.

## 4. Prisma Schema Sync

Before or after the first deployment, sync the schema:

```bash
npx prisma db push --accept-data-loss
npm run db:seed
```

Notes:

- `--accept-data-loss` is currently required because the schema includes a unique nullable `supabaseUserId` column.
- Only seed demo-safe data.

## 5. Stripe Webhook

In Stripe:

1. Create a webhook endpoint that points to:

```bash
https://your-demo-domain.vercel.app/api/webhooks/stripe
```

2. Subscribe to the events used by the app:

- `checkout.session.completed`
- `checkout.session.expired`
- `customer.subscription.deleted`
- `customer.subscription.updated`
- `invoice.payment_failed`

3. Copy the webhook signing secret into:

```bash
STRIPE_WEBHOOK_SECRET
```

## 6. OAuth Callback URLs

Only needed if you enable Google or GitHub login.

Use these callback URLs in each provider console:

```bash
https://your-demo-domain.vercel.app/api/auth/callback/google
https://your-demo-domain.vercel.app/api/auth/callback/github
```

## 7. Post-Deploy Smoke Test

After deployment, verify:

1. Homepage loads without database/runtime errors.
2. `/events` lists data from Supabase.
3. `/login` loads and shows:
   - email/password forms
   - only the OAuth providers that are actually configured
4. Registration sends a confirmation email.
5. Confirmed users can sign in with email/password.
6. Protected routes redirect correctly:
   - `/dashboard`
   - `/admin/dashboard`
7. Stripe checkout redirects back to the deployed site.
8. Stripe webhook updates booking/subscription state.

## 8. Demo Recommendations

For demo safety:

- use Stripe test mode only
- use a stable Vercel production URL, not a random preview URL
- keep seed/demo users documented
- avoid sharing admin credentials publicly
- verify Supabase email templates use the same deployed domain

## 9. Validation Commands

Run these before promoting a deployment:

```bash
npm run lint
npx tsc --noEmit
npm test -- --run
npm run build
```
