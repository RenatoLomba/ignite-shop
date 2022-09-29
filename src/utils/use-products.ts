import axios from 'axios'

import { useQuery } from '@tanstack/react-query'

import { getUrl } from './get-url'

export type Product = {
  id: string
  name: string
  coverUrl: string
  price: number
  priceId: string
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
