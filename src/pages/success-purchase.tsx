import axios from 'axios'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { useQuery } from '@tanstack/react-query'

import { styled } from '../styles'

const Container = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  height: 656,
  maxWidth: 590,
  width: '100%',

  p: {
    color: '$gray300',
    fontSize: '$xl',
    textAlign: 'center',
    marginBottom: 88,
  },

  a: {
    color: '$green500',
    fontWeight: 'bold',
    fontSize: '$lg',

    '&:hover': {
      color: '$green300',
    },
  },
})

const ImagesList = styled('div', {
  display: 'flex',
  gap: '0.5rem',
})

const ImageContainer = styled('div', {
  background: 'linear-gradient(180deg, #1EA483 0%, #7465D4 100%)',
  width: 127,
  height: 145,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  marginTop: '4rem',
  marginBottom: '2rem',

  img: {
    objectFit: 'cover',
  },
})

type Session = {
  id: string
  customerName: string
  products: {
    name: string
    coverUrl: string
  }[]
}

const SuccessPurchasePage: NextPage<{ sessionId: string }> = ({
  sessionId,
}) => {
  const { data: checkoutSession, isLoading } = useQuery(
    ['checkout-session', sessionId],
    async () => {
      const response = await axios.get<Session>(`/api/checkout/${sessionId}`)

      return response.data
    },
  )

  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>

        <meta name="robots" content="noindex" />
      </Head>
      <Container>
        {isLoading ? (
          <div>Loading...</div>
        ) : !checkoutSession ? (
          <div>No data</div>
        ) : (
          <>
            <h1>Compra efetuada!</h1>

            <ImagesList>
              {checkoutSession.products.map((product) => (
                <ImageContainer key={product.name}>
                  <Image
                    src={product.coverUrl}
                    alt={product.name}
                    width={115}
                    height={106}
                  />
                </ImageContainer>
              ))}
            </ImagesList>

            <p>
              Uhuul <strong>{checkoutSession.customerName}</strong>, sua{' '}
              <strong>{checkoutSession.products[0].name}</strong> e{' '}
              {checkoutSession.products.length > 1 &&
                `outras ${checkoutSession.products.length - 1}`}{' '}
              j?? est??o a caminho da sua casa
            </p>

            <Link href="/" passHref>
              <a>Voltar ao cat??logo</a>
            </Link>
          </>
        )}
      </Container>
    </>
  )
}

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { session_id: sessionId } = ctx.query

  if (!sessionId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { sessionId },
  }
}

export { getServerSideProps }
export default SuccessPurchasePage
