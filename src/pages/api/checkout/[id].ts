import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import { stripe } from '../../../utils/stripe'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ message: 'ID not provided' })
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    id as string,
    {
      expand: ['line_items', 'line_items.data.price.product'],
    },
  )

  const products = checkoutSession.line_items?.data?.map((product) => ({
    name: (product.price?.product as Stripe.Product).name,
    coverUrl: (product.price?.product as Stripe.Product).images[0],
  }))

  return res.json({
    id,
    customerName: checkoutSession.customer_details?.name,
    products,
  })
}
