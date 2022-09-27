import { useQuery } from '@tanstack/react-query'

import { stripe } from './stripe'

export const getProducts = async () => {
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

  return productsWithPrice
}

export const useProducts = () => {
  return useQuery(['products'], getProducts, {
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
