// lib/mailer.ts
import nodemailer from 'nodemailer'
import { renderToStaticMarkup } from 'react-dom/server'
import OrderReceivedEmail from '@/components/emails/OrderReceivedEmail'

export async function sendOrderEmail({
  to,
  orderId,
  orderDate,
  shippingAddress,
}: {
  to: string
  orderId: string
  orderDate: string
  shippingAddress: {
    name: string
    city: string
    country: string
    postalCode: string
    street: string
    state?: string
  }
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // Gmail requires SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const html = renderToStaticMarkup(
    OrderReceivedEmail({ orderId, orderDate, shippingAddress })
  )

  await transporter.sendMail({
    from: `"CaseCobra" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Thanks for your order!',
    html,
  })
}
