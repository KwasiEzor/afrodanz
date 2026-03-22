# AfroDanz Improvement Plan & Senior Dev Review

## 🌟 Analysis Summary
The AfroDanz project is built on a high-performance stack (Next.js 15, React 19, Prisma 7). It features a strong visual identity and clean architectural separation. However, several critical areas require hardening for production readiness.

## 🛠 Planned Improvements

### 1. Security & Validation (High Priority)
- **Goal:** Prevent invalid data entry and potential exploits.
- **Action:** Implement `zod` for schema validation in all Server Actions.
- **TDD:** Create tests for boundary cases (negative prices, empty titles, etc.).

### 2. Booking Race Condition Fix (Critical)
- **Goal:** Ensure an event cannot be overbooked if multiple users pay simultaneously.
- **Action:** Implement a "Pending Booking" status with a TTL (Time-To-Live) or use a database transaction to increment a `bookedCount` during checkout session creation.
- **TDD:** Simulate concurrent booking requests in tests.

### 3. Stripe Webhook Hardening
- **Goal:** Complete the subscription lifecycle.
- **Action:** Add handlers for `customer.subscription.deleted`, `invoice.payment_failed`, and `customer.subscription.updated`.
- **TDD:** Mock Stripe webhook events and verify database state changes.

### 4. Cache Invalidation Fix
- **Goal:** Ensure UI reflects the latest data.
- **Action:** Fix `revalidatePath` to target the correct slugs and tags.

### 5. UI/UX Refinement
- **Goal:** Professional feedback.
- **Action:** Replace `alert()` with a toast notification system (e.g., `sonner`).

---

## 🧪 TDD Strategy
1. **Red:** Write a failing test case for the specific improvement.
2. **Green:** Implement the minimal code to pass the test.
3. **Refactor:** Clean up the implementation while ensuring tests remain green.

## 📈 Git Tracking
- Commits will be made for each logical unit of work (Validation, Race Condition Fix, Webhook Update).
