import type { AppProps } from 'next/app'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  DehydratedState,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { styled } from '../styles'
import { globalStyles } from '../styles/global'

globalStyles()

const Container = styled('div', {
  '@media screen and (max-width: 1180px)': {
    padding: '0 2rem',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  minHeight: '100vh',
  justifyContent: 'center',
  overflow: 'hidden',
})

const Header = styled('header', {
  padding: '2rem 0',
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
})

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: DehydratedState }>) {
  const [client] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={client}>
      <Hydrate state={pageProps.dehydratedState}>
        <Container>
          <Header>
            <Link href="/" passHref>
              <a>
                <Image src="/logo.svg" alt="Logotipo" width={130} height={52} />
              </a>
            </Link>
          </Header>

          <Component {...pageProps} />
        </Container>
      </Hydrate>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
