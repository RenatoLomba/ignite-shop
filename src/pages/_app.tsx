import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
  DehydratedState,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { Header } from '../components'
import { ShoppingCartProvider } from '../contexts'
import { styled, globalStyles } from '../styles'

import 'react-modern-drawer/dist/index.css'

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

const ShoppingCartDrawer = dynamic(
  () =>
    import('../components/shopping-cart-drawer').then(
      (module) => module.ShoppingCartDrawer,
    ),
  {
    ssr: false,
  },
)

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: DehydratedState }>) {
  const [client] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={client}>
      <Hydrate state={pageProps.dehydratedState}>
        <ShoppingCartProvider>
          <Container>
            <Header />

            <Component {...pageProps} />

            <ShoppingCartDrawer />
          </Container>
        </ShoppingCartProvider>
      </Hydrate>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
