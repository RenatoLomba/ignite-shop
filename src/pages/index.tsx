import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { styled } from '../styles'
import { shirts } from '../utils/shirts'

const Container = styled('main', {
  display: 'flex',
  gap: '3rem',
  width: '100%',
  maxWidth: 'calc(100vw - ((100vw - 1180px) / 2))',
  marginLeft: 'auto',
  minHeight: 656,
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

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ignite Shop | Home</title>
      </Head>
      <Container>
        {shirts.slice(0, 2).map((shirt) => (
          <Link key={shirt.id} href={`/product/${shirt.id}`} passHref>
            <Product>
              <Image
                src={shirt.coverUrl}
                alt={shirt.name}
                width={520}
                height={480}
              />

              <footer>
                <strong>{shirt.name}</strong>
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    currency: 'BRL',
                    style: 'currency',
                  }).format(shirt.price)}
                </span>
              </footer>
            </Product>
          </Link>
        ))}
      </Container>
    </>
  )
}

export default Home
