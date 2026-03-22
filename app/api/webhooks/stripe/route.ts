import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"
import { BookingStatus, SubscriptionStatus } from "@prisma/client"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as any

  switch (event.type) {
    case "checkout.session.completed":
      const userId = session.metadata?.userId
      const eventId = session.metadata?.eventId
      const bookingId = session.metadata?.bookingId

      if (bookingId) {
        // Handle Event Booking
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: BookingStatus.PAID,
            expiresAt: null,
          },
        })
      } else if (userId && session.mode === 'subscription') {
        // Handle Subscription
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

    case "customer.subscription.deleted":
      const subscriptionDeleted = event.data.object as any
      await prisma.user.update({
        where: { stripeSubscriptionId: subscriptionDeleted.id },
        data: {
          subscriptionStatus: SubscriptionStatus.CANCELED,
        },
      })
      break

    case "customer.subscription.updated":
      const subscriptionUpdated = event.data.object as any
      // Handle status changes like 'past_due' or 'unpaid'
      await prisma.user.update({
        where: { stripeSubscriptionId: subscriptionUpdated.id },
        data: {
          subscriptionStatus: subscriptionUpdated.status.toUpperCase() as SubscriptionStatus,
        },
      })
      break

    case "invoice.payment_failed":
      const invoiceFailed = event.data.object as any
      if (invoiceFailed.subscription) {
        await prisma.user.update({
          where: { stripeSubscriptionId: invoiceFailed.subscription as string },
          data: {
            subscriptionStatus: SubscriptionStatus.PAST_DUE,
          },
        })
      }
      break
  }

  return new NextResponse(null, { status: 200 })
}
