# AfroDanz — improvement plan

This document records the planned fixes and enhancements (from codebase review). Work proceeds in dependency order so `build` and `lint` succeed.

## Phase 1 — Auth & build correctness

| Item | Action |
|------|--------|
| NextAuth v4 vs v5 mismatch | Upgrade to `next-auth@5` (beta) so `NextAuthConfig`, `handlers`, and `auth` match the code. |
| Session typing | Add module augmentation for `id`, `role`, `subscriptionStatus` on `Session["user"]` and JWT; remove `any` in callbacks. |
| Admin route guard in proxy | Extend `authorized` so `/admin` requires `token.role === "ADMIN"` (not only logged-in). |

## Phase 2 — Bookings & capacity

| Item | Action |
|------|--------|
| Stripe inside transaction | Keep DB work in `prisma.$transaction`; call `stripe.checkout.sessions.create` **after** commit. |
| Fragile booking upsert | Replace `upsert` + fake `'new-booking'` id with explicit find/create or update of the user’s `PENDING` booking. |
| Spots left on event page | Align with server: subtract non-expired `PENDING` holds from **other** users from `capacity` (same rules as `bookEvent`). |

## Phase 3 — Stripe webhook hardening

| Item | Action |
|------|--------|
| Subscription status mapping | Map Stripe subscription statuses explicitly to `SubscriptionStatus`; ignore or normalize unknown values. |
| Checkout completion | For paid events, verify `amount_total` matches expected event price (from DB) before marking `PAID`. |
| Dead code | Remove misleading placeholder `price_*` entries in `createSubscriptionSession` or replace with real Stripe Price IDs via env. |

## Phase 4 — Tooling & DX

| Item | Action |
|------|--------|
| Prisma generate | Add `postinstall` script: `prisma generate` so CI/local builds stay in sync with schema. |
| Turbopack root warning | Set `turbopack.root` in `next.config.ts` to this package directory (parent `package-lock.json` confuses inference). |
| ESLint | Fix or narrow rules: replace `any` with proper types, fix `react/no-unescaped-entities`, fix `DashboardUI` notification init without `setState` in `useEffect`. |
| Misc | Remove unused imports/vars; drop unused `Mail` import on login. |

## Phase 5 — Tests

| Item | Action |
|------|--------|
| Vitest | Update mocks if booking flow changes (transaction may return differently); extend webhook test for amount check if added. |

## Out of scope (this pass)

- Renaming asset `page_facbook_*` (would break URLs unless redirected).
- Production email for contact form (still stub).
- Database migrations for partial unique indexes (optional follow-up).

---

## Implementation status (completed)

| Phase | Notes |
|-------|--------|
| **1 — Auth** | Upgraded to `next-auth@5.0.0-beta.30`; added `types/next-auth.d.ts`; JWT/session callbacks typed; `/admin` requires `role === "ADMIN"` in `auth.config`; `proxy.ts` now uses the same `auth` instance as `lib/auth.ts` (JWT includes `role`). Wrapped app in `SessionProvider` via `app/providers.tsx`. |
| **2 — Bookings** | `bookEvent`: Stripe Checkout created **after** the transaction commits; replaced fragile `upsert` with `findFirst` + `update` / `create`. Event detail page **spots left** matches server rules (PAID + other users’ active PENDING holds). |
| **3 — Stripe** | Webhook: `subscription.updated` uses `lib/stripe-subscription-status.ts`; `checkout.session.completed` loads booking + event and checks `amount_total` vs `event.price` when `price > 0`; `createSubscriptionSession` uses `PLAN_AMOUNTS_EUR_CENTS` (no fake Price IDs). `lib/stripe.ts`: pinned API version `2026-02-25.clover`, build-safe placeholder key if `STRIPE_SECRET_KEY` missing. |
| **4 — Tooling** | `postinstall`: `prisma generate`; `next.config.ts`: `turbopack.root: process.cwd()`; ESLint clean on touched files; `force-dynamic` on DB-backed pages so `next build` succeeds without migrated DB. |
| **5 — Tests** | Vitest mocks updated for new booking flow and webhook `findUnique`; headers mock returns `Stripe-Signature`. |

### Follow-ups (not done here)

- Set `metadataBase` in root `metadata` if you care about absolute OG/Twitter image URLs in production.
- Replace Stripe build placeholder: always set `STRIPE_SECRET_KEY` in real deployments.
- Run `prisma migrate deploy` where the DB exists so dynamic pages work at runtime.

---

**Status:** Plan executed — `npm run lint`, `npm run test`, and `npm run build` succeed in this workspace.
