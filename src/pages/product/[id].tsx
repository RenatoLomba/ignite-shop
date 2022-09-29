import axios from 'axios'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'

import { useShoppingCart } from '../../contexts'
import { styled } from '../../styles'
import { getUrl } from '../../utils/get-url'
import { stripe } from '../../utils/stripe'
import { Product } from '../../utils/use-products'

const Container = styled('main', {
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  alignItems: 'stretch',
  gap: '4.5rem',

  '@media screen and (max-width: 1180px)': {
    gridTemplateColumns: '1fr',
    padding: '2rem 0',
  },
})

const ImageContainer = styled('div', {
  width: '100%',
  maxWidth: 576,
  height: 'calc(656px - 0.5rem)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #1EA483 0%, #7465D4 100%)',
  borderRadius: 8,

  img: {
    objectFit: 'cover',
  },

  '@media screen and (max-width: 1180px)': {
    height: 'auto',
    maxWidth: '100%',
  },
})

const ProductDetailsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  h1: {
    fontSize: '$2xl',
    color: '$gray300',
  },

  span: {
    color: '$green300',
    fontSize: '$2xl',
    marginTop: '1rem',
    display: 'block',
  },

  p: {
    fontSize: '$md',
    color: '$gray300',
    lineHeight: 1.6,
    flex: 1,
    marginTop: '2.5rem',
    marginBottom: '1rem',
  },
})

const PurchaseButton = styled('button', {
  background: '$green500',
  color: '$white',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1.25rem 0',
  borderRadius: 8,
  fontWeight: 'bold',
  fontSize: '$md',
  transition: 'filter 0.2s ease',
  border: 0,

  '&:hover': {
    filter: 'brightness(0.8)',
  },

  '&:disabled': {
    opacity: 0.6,
  },
})

type ProductDetails = Product & { description?: string | null }

const getProduct = async (productId: string) => {
  const { data } = await axios.get<ProductDetails>(
    getUrl() + `/api/products/${productId}`,
  )

  return data
}

const getStaticProps: GetStaticProps = async (ctx) => {
  const productId = ctx.params?.id as string

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['product', productId], async () =>
    getProduct(productId),
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 2, // 2 minutes
  }
}

const getStaticPaths: GetStaticPaths = async (ctx) => {
  const products = await stripe.products.list({
    limit: 20,
  })

  return {
    paths: products.data.map((product) => {
      return {
        params: { id: product.id },
      }
    }),
    fallback: 'blocking',
  }
}

const ProductPage: NextPage = () => {
  const { query } = useRouter()
  const { id: productId } = query

  const { addItemToCart } = useShoppingCart()

  const { data: product } = useQuery(
    ['product', productId],
    async () => {
      if (!productId) return null

      return getProduct(productId as string)
    },
    {
      retry: true,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  )

  if (!product) {
    return <div>No product</div>
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      <Container>
        <ImageContainer>
          <Image
            src={product.coverUrl}
            alt={product.name}
            width={520}
            height={480}
          />
        </ImageContainer>

        <ProductDetailsContainer>
          <h1>{product.name}</h1>

          <span>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(product.price)}
          </span>

          <p>{product.description}</p>

          <PurchaseButton
            onClick={() => addItemToCart(product.id, product.priceId)}
          >
            Comprar agora
          </PurchaseButton>
        </ProductDetailsContainer>
      </Container>
    </>
  )
}

export { getStaticProps, getStaticPaths }
export default ProductPage
