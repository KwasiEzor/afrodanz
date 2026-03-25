# AfroDanz Audit Implementation Plan

## Status Legend
- [ ] Pending
- [x] Completed

---

## Phase 1 — P0: Critical Bugs & Security Fixes

- [x] **1.1** Fix booking race condition with serializable transaction isolation
- [x] **1.2** Add type guards to Stripe webhook type casts (subscription/customer can be objects)
- [x] **1.3** Add Zod validation + sanitization to contact form server action
- [x] **1.4** Guard `STRIPE_WEBHOOK_SECRET` with early return in webhook handler

## Phase 2 — P1: Data Integrity & Error Handling

- [x] **2.1** Protect event deletion when paid bookings exist (restrict or soft-delete)
- [x] **2.2** Verify checkout session on success page (validate payment before showing confirmation)
- [x] **2.3** Add `error.tsx` and `loading.tsx` boundaries (root, events, dashboard, admin)
- [x] **2.4** Create shared `formatPrice()` and `formatDate()` utilities, replace all hardcoded usages

## Phase 3 — P1 continued: Performance & Queries

- [x] **3.1** Paginate admin dashboard queries (events + bookings)
- [x] **3.2** Add `user_metadata` null check in `supabase-auth.ts`
- [x] **3.3** Fix invalid date coercion in event Zod schema (custom `.refine()`)
- [x] **3.4** Add null guard on `totalSpent` calculation in DashboardUI

## Phase 4 — P2: i18n, SEO & Cookies

- [x] **4.1** Complete i18n coverage: BookingButton, EventsList, checkout/success, DashboardUI banners
- [x] **4.2** Dynamic `<html lang>` attribute based on current locale
- [x] **4.3** Add `SameSite=Lax` to all client-side cookies (locale + consent)
- [x] **4.4** Switch home page from `force-dynamic` to ISR with `revalidate`
- [x] **4.5** Add input max-length constraints to all Zod schemas (events, auth, contact)

## Phase 5 — P3: UX/UI & Responsiveness

- [x] **5.1** Fix admin grid breakpoint bug (`lg:grid-cols-1` → correct layout)
- [x] **5.2** Add loading skeletons/spinners for event filtering in EventsList
- [x] **5.3** Fix dashboard nav for small screens (min-width, text truncation)
- [x] **5.4** Enforce consistent card heights in EventsPreview grid

---

## Validation Protocol
Each phase:
1. Implement all items in the phase
2. Run `npm run lint && npx tsc --noEmit && npm test` to validate
3. Commit and push to GitHub
4. Check off items before proceeding to next phase
