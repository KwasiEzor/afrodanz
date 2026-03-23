import { SubscriptionStatus } from "@prisma/client"

/** Map Stripe subscription.status to our Prisma enum; unknown values are skipped by the caller. */
export function subscriptionStatusFromStripe(
  stripeStatus: string
): SubscriptionStatus | null {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return SubscriptionStatus.ACTIVE
    case "past_due":
    case "unpaid":
      return SubscriptionStatus.PAST_DUE
    case "canceled":
    case "incomplete_expired":
      return SubscriptionStatus.CANCELED
    case "incomplete":
      return SubscriptionStatus.INCOMPLETE
    case "paused":
      return SubscriptionStatus.CANCELED
    default:
      return null
  }
}
