import { NextApiRequest, NextApiResponse } from 'next'

import { stripe } from '../../../utils/stripe'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(400).json({ message: 'Cannot POST to /products' })
  }

  const products = await stripe.products.list({
    expand: ['data.default_price'],
  })

  const productsWithPrice = products.data.map((product) => {
    return {
      id: product.id,
      name: product.name,
      coverUrl: product.images[0],
      price:
        typeof product.default_price !== 'string'
          ? product.default_price!.unit_amount! / 100
          : 0,
      priceId:
        typeof product.default_price !== 'string'
          ? product.default_price!.id!
          : '',
    }
  })

  return res.json(productsWithPrice)
}
