import { useKeenSlider } from 'keen-slider/react'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { useQuery, QueryClient, dehydrate } from '@tanstack/react-query'

import 'keen-slider/keen-slider.min.css'

import { styled } from '../styles'
import { stripe } from '../utils/stripe'

const Container = styled('main', {
  display: 'flex',
  width: '100%',
})

const Product = styled('a', {
  background: 'linear-gradient(180deg, #1EA483 0%, #7465D4 100%)',
  borderRadius: 8,
  padding: '0.25rem',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',

  img: {
    objectFit: 'cover',
  },

  footer: {
    position: 'absolute',
    bottom: '0.25rem',
    left: '0.25rem',
    right: '0.25rem',
    borderRadius: 6,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '2rem',

    transform: 'translateY(110%)',
    opacity: 0,
    transition: 'all 0.2s ease-in-out',

    strong: {
      color: '$gray100',
      fontSize: '$lg',
    },

    span: {
      color: '$green300',
      fontWeight: 'bold',
      fontSize: '$xl',
    },
  },

  '&:hover': {
    footer: {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
})

const getProducts = async () => {
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
    }
  })

  return productsWithPrice
}

const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['products'], getProducts)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 2, // 2 minutes
  }
}

const Home: NextPage = () => {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  })

  const { data: products } = useQuery(['products'], getProducts, {
    staleTime: 1000 * 30,
  })

  return (
    <>
      <Head>
        <title>Ignite Shop | Home</title>
      </Head>
      <Container ref={sliderRef} className="keen-slider">
        {products?.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} passHref>
            <Product className="keen-slider__slide">
              <Image
                src={product.coverUrl}
                alt={product.name}
                width={520}
                height={480}
              />

              <footer>
                <strong>{product.name}</strong>
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    currency: 'BRL',
                    style: 'currency',
                  }).format(product.price)}
                </span>
              </footer>
            </Product>
          </Link>
        ))}
      </Container>
    </>
  )
}

export { getStaticProps }
export default Home
