# AfroDanz — Professional Project Review

## Executive Summary

AfroDanz has a good product foundation: modern Next.js App Router structure, Prisma + Postgres, Auth.js, Stripe checkout, an admin back office, and a clear visual identity. The code is readable, the architecture is understandable, and the product direction is coherent.

The main problem is not visual quality. It is conversion-path reliability. The public site looks polished, but several key user journeys are either partially mocked, structurally fragile, or not fully production-ready:

- the homepage event cards are disconnected from real database records
- external images are not configured for `next/image`
- booking integrity still depends too heavily on application-level checks
- several CTAs and dashboard actions are placeholders
- the codebase passes lint/tests, but TypeScript validation still fails

This is a strong base for iteration, but it still behaves more like an advanced prototype than a hardened production app.

---

## What Is Strong

### 1. Architecture

- Clear separation between server actions, server-rendered pages, and client interactivity
- Good choice of stack for the problem: Next.js App Router, Prisma, Auth.js, Stripe
- Booking flow correctly keeps Stripe session creation outside the database transaction
- Auth callbacks enrich JWT/session with role and subscription state
- Admin and member experiences are separated cleanly

### 2. Product Structure

- The app has clear sections: marketing site, events catalog, event detail, member dashboard, admin dashboard
- The domain model is simple and appropriate for the use case
- Admin users can create and manage events without needing direct database access

### 3. Design Direction

- Strong visual identity with a consistent palette and typography
- Good use of spacing, hierarchy, and motion
- The site feels intentional rather than generic
- Metadata, OG, and social sharing basics are present

### 4. Basic Operational Quality

- `npm run lint` passes
- `npm test -- --run` passes
- Some coverage already exists for bookings, events, and Stripe webhook logic

---

## Confirmed Issues

## Critical

### 1. Homepage event booking is wired to fake data

**Files:** `app/components/EventsPreview.tsx`, `app/actions/bookings.ts`

The homepage and the event-detail recommendations use a hardcoded `EVENTS` array with fake ids like `cl1`, `cl2`, and `cl3`. Those ids are passed into `bookEvent()`, which only books real Prisma event ids.

**Impact**

- "Join Event" from the homepage can fail with `Event not found`
- hardcoded slugs can drift from the database and lead to broken detail links
- the main conversion flow is unreliable

**Recommendation**

- replace `EventsPreview` with real event data from Prisma
- if booking directly from a preview card is kept, only use real event ids
- otherwise make the preview CTA link to the event detail page

### 2. Remote images are not configured

**Files:** `next.config.ts`, `app/about/page.tsx`, `app/dashboard/DashboardUI.tsx`, `app/admin/dashboard/AdminDashboardUI.tsx`

The app renders user avatars and optional event images through `next/image`, but `next.config.ts` has no `images.remotePatterns` configuration.

**Impact**

- Google/GitHub profile images can fail
- remote event images can fail
- production pages can break around core UI assets

**Recommendation**

- add `images.remotePatterns` for known providers
- decide whether arbitrary admin-provided image URLs are allowed or should be restricted

### 3. Booking integrity is not protected strongly enough at database level

**Files:** `app/actions/bookings.ts`, `prisma/schema.prisma`

The booking flow checks capacity and duplicate bookings in application code, but there is no DB-level uniqueness rule for a user booking the same event, and no stronger concurrency control around capacity.

**Impact**

- duplicate bookings are still possible under concurrent requests
- overselling remains possible in edge cases
- payment and booking state can diverge under failure conditions

**Recommendation**

- add a DB constraint strategy for duplicate bookings
- decide whether uniqueness should apply to all bookings or only active/paid bookings
- strengthen capacity handling for concurrent checkout attempts
- add lifecycle handling for stale pending bookings

---

## High

### 4. Next.js route props still use pre-15/16 sync patterns

**Files:** `app/events/page.tsx`, `app/events/[slug]/page.tsx`

This project uses Next.js 16. The local Next docs in `node_modules/next/dist/docs/` show `params` and `searchParams` as promise-based props. These pages still access them synchronously.

**Impact**

- this is a compatibility risk against current framework conventions
- it increases the chance of build/runtime issues as the framework tightens enforcement

**Recommendation**

- update route signatures to current Next 16 conventions
- use `await params` / `await searchParams` or `PageProps<'/route'>`

### 5. Checkout URLs depend on unvalidated environment configuration

**Files:** `app/actions/bookings.ts`, `lib/stripe.ts`, `app/api/webhooks/stripe/route.ts`

Stripe success/cancel URLs are built from `NEXT_PUBLIC_APP_URL`, and webhook secret access uses a non-null assertion. The Stripe client also falls back to a placeholder secret key at import time.

**Impact**

- broken redirects if `NEXT_PUBLIC_APP_URL` is missing or incorrect
- confusing runtime Stripe failures if secrets are misconfigured
- poor operational debugging

**Recommendation**

- centralize environment validation
- fail clearly and early in production
- keep build-safe behavior only where genuinely necessary

### 6. TypeScript validation still fails

**Files:** `app/actions/bookings.test.ts`, `app/actions/events.test.ts`, `app/api/webhooks/stripe/route.test.ts`

The repository passes lint and Vitest, but `npx tsc --noEmit` fails because several tests use unsafe casts that do not satisfy the real types.

**Impact**

- CI confidence is lower than it looks
- refactors are riskier because the type system is not fully trusted

**Recommendation**

- fix mocks so they satisfy the real contract
- make `tsc --noEmit` part of the validation gate

### 7. Event detail page duplicates the site navigation

**Files:** `app/layout.tsx`, `app/components/Navbar.tsx`, `app/events/[slug]/page.tsx`

The global navbar is still rendered on event detail pages, and the detail page adds its own fixed top navigation.

**Impact**

- visual duplication
- risk of stacked fixed bars and spacing issues
- weaker information hierarchy

**Recommendation**

- hide the global navbar on event detail pages, or
- remove the custom detail-page top bar and use the global nav consistently

---

## Medium

### 8. Search debounce is broken

**File:** `app/components/EventsList.tsx`

The search input creates a `setTimeout` inside `onChange` and returns a cleanup function from the event handler. React ignores cleanup returns from event handlers.

**Impact**

- multiple stale navigations can fire while typing
- unnecessary client routing churn
- inconsistent search UX

**Recommendation**

- manage debouncing with state and `useEffect`, or
- use a controlled input with a stable debounced callback

### 9. Landmark semantics are incorrect

**Files:** `app/layout.tsx`, `app/page.tsx`, `app/contact/page.tsx`, `app/dashboard/DashboardUI.tsx`, `app/admin/dashboard/AdminDashboardUI.tsx`, `app/events/[slug]/page.tsx`

The root layout already renders a `<main>`, but several pages/components render nested `<main>` elements.

**Impact**

- weaker accessibility semantics
- poorer screen-reader landmark navigation

**Recommendation**

- keep one root `<main>` per page
- convert nested page-level `<main>` blocks to `<div>` or `<section>`

### 10. Public-site credibility drops on click

**Files:** `app/components/Hero.tsx`, `app/page.tsx`, `app/contact/page.tsx`

Several visible actions are placeholders or dead ends:

- hero CTA buttons do nothing
- footer legal/contact links use `#`
- social links use `#`
- the map block is a placeholder

**Impact**

- trust drops quickly after first click
- the polished visual layer overpromises relative to actual functionality

**Recommendation**

- connect hero CTAs to real destinations
- replace placeholder links with real routes or remove them until available
- either embed a real map or present the address more honestly as static content

### 11. User feedback patterns are inconsistent

**Files:** `app/components/EventsPreview.tsx`, `app/components/Pricing.tsx`, `app/components/BookingButton.tsx`

Some interactions use `alert()`, others use `toast.error()`.

**Impact**

- inconsistent UX tone
- less polished error handling

**Recommendation**

- standardize user feedback around Sonner

### 12. Several dashboard/admin actions are not implemented

**Files:** `app/dashboard/DashboardUI.tsx`, `app/contact/ContactForm.tsx`

Examples:

- "Download PDF" has no implementation
- "Edit Account Information" has no implementation
- "Request Account Deletion" has no implementation
- contact handling is still a stub that logs to console
- the mobile dashboard header button has an empty click handler

**Impact**

- admin/member experience feels incomplete
- users can see actions they cannot complete

**Recommendation**

- hide unfinished actions or implement them
- avoid surfacing dead controls in production UI

### 13. `force-dynamic` is used aggressively

**Files:** `app/events/page.tsx`, `app/events/[slug]/page.tsx`, `app/about/page.tsx`, `app/dashboard/page.tsx`, `app/admin/dashboard/page.tsx`

Some pages likely need dynamic rendering, but not all of them benefit equally from `force-dynamic`.

**Impact**

- more server/database load than necessary
- weaker caching story

**Recommendation**

- audit which pages truly need request-time rendering
- use revalidation where content changes infrequently

### 14. Large UI files are doing too much

**Files:** `app/dashboard/DashboardUI.tsx`, `app/admin/dashboard/AdminDashboardUI.tsx`

These files contain several views, multiple interactive states, and dense markup.

**Impact**

- slower iteration
- harder testing
- weaker component reuse

**Recommendation**

- split by screen section or tab
- move repeated patterns into smaller presentational components

---

## Low

### 15. The current review pipeline is incomplete

**Validation performed**

- `npm run lint`: passed
- `npm test -- --run`: passed
- `npx tsc --noEmit`: failed

`npm run build` was not fully validated in the current workspace because an existing `.next` lock blocked a clean run. Next.js also warned that it inferred the workspace root from a parent `package-lock.json`, which suggests `turbopack.root` should be configured.

**Recommendation**

- clean the build state
- configure `turbopack.root`
- make `build` part of the final validation gate

### 16. Production resilience features are still missing

Missing or absent from the app directory:

- `error.tsx`
- `loading.tsx`
- global `not-found.tsx`
- rate limiting for public mutation paths

**Impact**

- weaker error recovery
- rougher route transitions
- default framework fallbacks in production

---

## UX/UI Review

### What works

- The visual identity is strong and memorable
- The homepage hero has impact
- The brand feels energetic and premium
- The admin and member dashboards are visually coherent with the marketing site

### What needs work

- too many visible actions are placeholders
- the homepage promises immediate booking but the underlying data is mocked
- the event search/filter UX needs more polish
- the dashboard should prioritize trustworthy utility over decorative cards
- the site still needs stronger accessibility discipline despite good intent

### Practical UX improvements

- make all primary CTAs real before adding more motion
- simplify the event preview actions to one obvious next step
- improve empty states so they guide the user to the next action
- ensure dashboard actions are either implemented or hidden
- tighten keyboard/focus behavior across nav, cards, filters, and modal flows

---

## Suggested Improvement Roadmap

## Milestone 1. Public Flow Reliability

- Replace hardcoded homepage/recommendation events with real database queries
- Fix preview links and booking actions
- Wire hero/footer/contact CTAs to real destinations
- Standardize user-facing error/success feedback

**Validation**

- lint
- tests
- manual flow check: homepage -> event detail -> booking entry point

## Milestone 2. Framework and Build Correctness

- Update async `params` / `searchParams` handling for Next 16
- Add `next/image` remote configuration
- Fix `tsc --noEmit`
- Configure `turbopack.root` if needed

**Validation**

- lint
- tests
- `tsc --noEmit`
- `next build`

## Milestone 3. Booking and Payment Hardening

- Add stronger booking constraints
- Add pending-booking lifecycle cleanup strategy
- Improve environment validation for Stripe and app URLs
- Harden webhook failure handling and observability

**Validation**

- unit/integration tests for booking concurrency assumptions
- webhook tests
- build

## Milestone 4. Dashboard/Admin Product Completion

- Implement or hide unfinished actions
- Improve mobile dashboard behavior
- Break large UI files into smaller components
- Add better loading, error, and empty states

**Validation**

- lint
- tests
- targeted manual QA of dashboard/admin flows

## Milestone 5. Production Readiness

- Add route-level error/loading/not-found handling
- Add rate limiting on public mutation surfaces
- Revisit caching strategy
- Review observability and operational safeguards

**Validation**

- full regression run
- build
- deploy-preview QA

---

## Final Assessment

## Grades

| Area | Grade | Notes |
|------|-------|-------|
| Architecture | B+ | Good stack and structure, but not fully hardened |
| Security | B | Reasonable base, but config/runtime hardening is still needed |
| Data Integrity | C+ | Booking logic is thoughtful, DB guarantees are still too weak |
| Code Quality | B | Readable and mostly clean, but some large files and incomplete validation |
| Production Readiness | C | Strong prototype, not fully production-safe yet |
| Testing | C+ | Useful starting coverage, but `tsc` still fails and build validation is incomplete |
| UX/UI | B+ | Strong visual design, weaker follow-through on functional credibility |

## Top Priorities

1. Fix the public booking funnel by replacing mocked event cards with real data.
2. Fix framework/build correctness: Next 16 route props, remote image config, TypeScript failures, clean build.
3. Harden booking/payment integrity with stronger DB guarantees and better runtime validation.

The project is worth continuing. The foundation is good enough that improvements will compound quickly once the public flow and correctness issues are fixed first.
