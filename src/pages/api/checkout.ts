import { NextApiRequest, NextApiResponse } from 'next'

import { stripe } from '../../utils/stripe'

const getUrl = () => process.env.VERCEL_URL || 'http://localhost:3000'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(400).json('Cannot GET to /checkout')
  }

  const { priceId } = req.body

  if (!priceId) {
    return res
      .status(400)
      .json({ message: 'Price ID is required to create checkout session' })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    cancel_url: req.headers.referer || req.headers.host!, // who sent the request
    success_url: getUrl() + '/success-purchase',
  })

  return res.status(201).json({ checkoutUrl: checkoutSession.url })
}
