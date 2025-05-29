// emails/OrderReceivedEmail.tsx
interface Props {
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
}

export default function OrderReceivedEmail({ orderId, orderDate, shippingAddress }: Props) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <h2>Thanks for your order!</h2>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Date:</strong> {orderDate}</p>
      <h3>Shipping Address</h3>
      <p>
        {shippingAddress.name}<br />
        {shippingAddress.street}, {shippingAddress.city}<br />
        {shippingAddress.state ? `${shippingAddress.state}, ` : ''}
        {shippingAddress.country} - {shippingAddress.postalCode}
      </p>
    </div>
  )
}
