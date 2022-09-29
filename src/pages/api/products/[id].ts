import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import { stripe } from '../../../utils/stripe'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(400).json({ message: 'Cannot POST to /products/:id' })
  }

  const productId = req.query.id as string

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  const productDetails = {
    id: product.id,
    name: product.name,
    price: price.unit_amount! / 100,
    priceId: price.id,
    description: product.description,
    coverUrl: product.images[0],
  }

  return res.json(productDetails)
}
