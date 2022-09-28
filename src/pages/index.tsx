import { useKeenSlider } from 'keen-slider/react'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Bag } from 'phosphor-react'

import { QueryClient, dehydrate } from '@tanstack/react-query'

import 'keen-slider/keen-slider.min.css'

import { useShoppingCart } from '../contexts'
import { styled } from '../styles'
import { getProducts, useProducts } from '../utils/use-products'

const Container = styled('main', {
  display: 'flex',
  width: '100%',
})

const Product = styled('div', {
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
      display: 'block',
    },

    span: {
      color: '$green300',
      fontWeight: 'bold',
      fontSize: '$xl',
      display: 'block',
    },

    a: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },

  '&:hover': {
    footer: {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
})

const BagButton = styled('button', {
  background: '$green500',
  color: '$white',
  borderRadius: 6,
  border: 'none',
  lineHeight: 0,
  padding: '0.75rem',
  transition: 'filter 0.2s ease',

  '&:hover': {
    filter: 'brightness(0.90)',
  },
})

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
  const { addItemToCart } = useShoppingCart()

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  })

  const { data: products } = useProducts()

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
      <Container ref={sliderRef} className="keen-slider">
        {products?.map((product) => (
          <Product key={product.id} className="keen-slider__slide">
            <Link href={`/product/${product.id}`} passHref prefetch={false}>
              <a>
                <Image
                  src={product.coverUrl}
                  alt={product.name}
                  width={520}
                  height={480}
                />
              </a>
            </Link>

            <footer>
              <div>
                <Link href={`/product/${product.id}`} passHref prefetch={false}>
                  <a>
                    <strong>{product.name}</strong>
                  </a>
                </Link>
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    currency: 'BRL',
                    style: 'currency',
                  }).format(product.price)}
                </span>
              </div>

              <div>
                <BagButton
                  onClick={() => addItemToCart(product.id, product.priceId)}
                >
                  <Bag size={32} />
                </BagButton>
              </div>
            </footer>
          </Product>
        ))}
      </Container>
    </>
  )
}

export { getStaticProps }
export default Home
