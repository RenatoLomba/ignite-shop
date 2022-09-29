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

  if (typeof process.env.VERCEL_URL !== 'undefined')
    return process.env.VERCEL_URL

  return 'http://localhost:3000'
}

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await axios.get<Product[]>(getUrl() + '/api/products')

  return data
}

export const useProducts = (initialData?: Product[]) => {
  return useQuery(['products'], getProducts, {
    staleTime: 1000 * 60 * 2, // 2 minutes
    initialData,
  })
}
