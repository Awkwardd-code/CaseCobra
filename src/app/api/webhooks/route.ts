import { db } from '@/db'
import { sendOrderEmail } from '@/lib/mailer'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = (await headers()).get('stripe-signature')

        if (!signature) {
            return new Response('Invalid signature', { status: 400 })
        }

        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session & {
                shipping_details?: {
                    address: Stripe.Address
                }
            }

            if (!session.customer_details?.email) {
                throw new Error('Missing user email')
            }

            const { userId, orderId } = session.metadata || {
                userId: null,
                orderId: null,
            }

            if (!userId || !orderId) {
                throw new Error('Invalid request metadata')
            }

            const billingAddress = session.customer_details.address
            const shippingAddress = session.shipping_details?.address

            if (!shippingAddress) {
                throw new Error('Missing shipping address')
            }

            const updatedOrder = await db.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    isPaid: true,
                    shippingAddress: {
                        create: {
                            name: session.customer_details.name!,
                            city: shippingAddress.city!,
                            country: shippingAddress.country!,
                            postalCode: shippingAddress.postal_code!,
                            street: shippingAddress.line1!,
                            state: shippingAddress.state ?? undefined,
                        },
                    },
                    billingAddress: {
                        create: {
                            name: session.customer_details.name!,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                            city: billingAddress?.city!,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                            country: billingAddress?.country!,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                            postalCode: billingAddress?.postal_code!,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                            street: billingAddress?.line1!,
                            state: billingAddress?.state ?? undefined,
                        },
                    },
                },
            })

            await sendOrderEmail({
                to: session.customer_details.email!,
                orderId,
                orderDate: updatedOrder.createdAt.toLocaleDateString(),
                shippingAddress: {
                    name: session.customer_details.name!,
                    city: shippingAddress.city!,
                    country: shippingAddress.country!,
                    postalCode: shippingAddress.postal_code!,
                    street: shippingAddress.line1!,
                    state: shippingAddress.state ?? undefined,
                },
            })
        }

        return NextResponse.json({ result: event, ok: true })
    } catch (err) {
        console.error(err)

        return NextResponse.json(
            { message: 'Something went wrong', ok: false },
            { status: 500 }
        )
    }
}