import { NextApiRequest, NextApiResponse } from 'next'

import { stripe } from '../../../utils/stripe'

const getUrl = () => process.env.VERCEL_URL || 'http://localhost:3000'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(400).json('Cannot GET to /checkout')
  }

  const { products } = req.body

  if (!products) {
    return res
      .status(400)
      .json({ message: 'Products are required to create checkout session' })
  }

  if (!Array.isArray(products)) {
    return res
      .status(400)
      .json({ message: 'Products must be an array to create checkout session' })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: products.map((product) => ({
      quantity: 1,
      price: product.priceId,
    })),
    cancel_url: req.headers.referer || req.headers.host!, // who sent the request
    success_url: `${getUrl()}/success-purchase?session_id={CHECKOUT_SESSION_ID}`,
  })

  return res.status(201).json({ checkoutUrl: checkoutSession.url })
}
