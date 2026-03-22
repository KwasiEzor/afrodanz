import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
...

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

  if (event.type === "checkout.session.completed") {
    // Handle successful subscription or one-time payment
    const userId = session.metadata?.userId
    const eventId = session.metadata?.eventId

    if (eventId) {
      // It was an event booking
      await prisma.booking.create({
        data: {
          userId,
          eventId,
          status: "PAID",
        },
      })
    } else {
      // It was a subscription
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeSubscriptionId: session.subscription as string,
          subscriptionStatus: "ACTIVE",
        },
      })
    }
  }

  return new NextResponse(null, { status: 200 })
}
