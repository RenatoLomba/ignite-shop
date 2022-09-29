import axios from 'axios'

import { useQuery } from '@tanstack/react-query'

export type Product = {
  id: string
  name: string
  coverUrl: string
  price: number
  priceId: string
}

const getUrl = () => {
  if (typeof window !== 'undefined') return ''

  if (process.env.VERCEL_URL) return process.env.VERCEL_URL

  return 'http://localhost:3000'
}

export const getProducts = async (): Promise<Product[]> => {
  const url = getUrl()

  const { data } = await axios.get<Product[]>(
    url.endsWith('/') ? url + 'api/products' : url + '/api/products',
  )

  return data
}

export const useProducts = (initialData?: Product[]) => {
  return useQuery(['products'], getProducts, {
    staleTime: 1000 * 60 * 2, // 2 minutes
    initialData,
  })
}
