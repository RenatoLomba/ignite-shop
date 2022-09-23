import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { styled } from '../styles'

const Container = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
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

const SuccessPurchasePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ignite Shop | Sucesso na compra</title>
      </Head>
      <Container>
        <h1>Compra efetuada!</h1>

        <ImageContainer>
          <Image src="/shirts/camiseta-1.png" alt="" width={115} height={106} />
        </ImageContainer>

        <p>
          Uhuul <strong>Diego Fernandes</strong>, sua{' '}
          <strong>Camiseta XXXXXXXXXXXXXX</strong> já está a caminho da sua casa
        </p>

        <Link href="/" passHref>
          <a>Voltar ao catálogo</a>
        </Link>
      </Container>
    </>
  )
}

export default SuccessPurchasePage
