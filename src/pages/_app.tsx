import type { AppProps } from 'next/app'
import Image from 'next/image'

import { styled } from '../styles'
import { globalStyles } from '../styles/global'

globalStyles()

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  minHeight: '100vh',
  justifyContent: 'center',
})

const Header = styled('header', {
  padding: '2rem 0',
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Image src="/logo.svg" alt="Logotipo" width={130} height={52} />
      </Header>

      <Component {...pageProps} />
    </Container>
  )
}
