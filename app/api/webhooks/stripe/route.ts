import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"
import { BookingStatus, SubscriptionStatus } from "@prisma/client"
import { subscriptionStatusFromStripe } from "@/lib/stripe-subscription-status"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature")
  if (!signature) {
    return new NextResponse("Missing Stripe-Signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.bookingId
      const userId = session.metadata?.userId

      if (bookingId) {
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { event: true },
        })

        if (!booking) {
          console.error("Stripe webhook: booking not found", bookingId)
          break
        }

        if (session.payment_status !== "paid") {
          break
        }

        if (
          booking.event.price > 0 &&
          session.amount_total != null &&
          session.amount_total !== booking.event.price
        ) {
          console.error("Stripe webhook: amount mismatch", {
            bookingId,
            expected: booking.event.price,
            got: session.amount_total,
          })
          break
        }

        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: BookingStatus.PAID,
            expiresAt: null,
          },
        })
      } else if (userId && session.mode === "subscription") {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: session.subscription as string,
            stripeCustomerId: session.customer as string,
            subscriptionStatus: SubscriptionStatus.ACTIVE,
          },
        })
      }
      break
    }

    case "customer.subscription.deleted": {
      const subscriptionDeleted = event.data.object as Stripe.Subscription
      await prisma.user.update({
        where: { stripeSubscriptionId: subscriptionDeleted.id },
        data: {
          subscriptionStatus: SubscriptionStatus.CANCELED,
        },
      })
      break
    }

    case "customer.subscription.updated": {
      const subscriptionUpdated = event.data.object as Stripe.Subscription
      const nextStatus = subscriptionStatusFromStripe(subscriptionUpdated.status)
      if (nextStatus) {
        await prisma.user.update({
          where: { stripeSubscriptionId: subscriptionUpdated.id },
          data: {
            subscriptionStatus: nextStatus,
          },
        })
      }
      break
    }

    case "invoice.payment_failed": {
      const invoiceFailed = event.data.object as Stripe.Invoice & {
        subscription?: string | Stripe.Subscription | null
      }
      const subId =
        typeof invoiceFailed.subscription === "string"
          ? invoiceFailed.subscription
          : invoiceFailed.subscription?.id
      if (subId) {
        await prisma.user.update({
          where: { stripeSubscriptionId: subId },
          data: {
            subscriptionStatus: SubscriptionStatus.PAST_DUE,
          },
        })
      }
      break
    }
  }

  return new NextResponse(null, { status: 200 })
}
