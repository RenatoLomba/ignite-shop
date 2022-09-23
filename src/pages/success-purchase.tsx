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
  productName: string
  coverUrl: string
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
        <title>Ignite Shop | Sucesso na compra</title>
      </Head>
      <Container>
        {isLoading ? (
          <div>Loading...</div>
        ) : !checkoutSession ? (
          <div>No data</div>
        ) : (
          <>
            <h1>Compra efetuada!</h1>

            <ImageContainer>
              <Image
                src={checkoutSession.coverUrl}
                alt={checkoutSession.productName}
                width={115}
                height={106}
              />
            </ImageContainer>

            <p>
              Uhuul <strong>{checkoutSession.customerName}</strong>, sua{' '}
              <strong>{checkoutSession.productName}</strong> já está a caminho
              da sua casa
            </p>

            <Link href="/" passHref>
              <a>Voltar ao catálogo</a>
            </Link>
          </>
        )}
      </Container>
    </>
  )
}

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { session_id: sessionId } = ctx.query

  console.log(sessionId)

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
