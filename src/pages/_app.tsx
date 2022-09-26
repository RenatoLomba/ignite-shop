import produce from 'immer'
import type { AppProps } from 'next/app'
import Image from 'next/image'
import Link from 'next/link'
import { Bag } from 'phosphor-react'
import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from 'react'

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
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const BagButton = styled('button', {
  background: '$gray800',
  color: '$gray500',
  borderRadius: 6,
  border: 'none',
  lineHeight: 0,
  padding: '0.75rem',
  transition: 'background 0.2s ease, color 0.2s ease',

  '&:hover': {
    background: '$green500',
    color: '$white',
  },
})

type ShoppingCartItem = {
  id: string
  priceId: string
}

type ShoppingCartContextData = {
  items: ShoppingCartItem[]
  isShoppingCartModalOpen: boolean
  addItemToCart: (id: string, priceId: string) => void
  removeItemFromCart: (id: string) => void
  openShoppingCart: () => void
  closeShoppingCart: () => void
}

type ShoppingCartState = {
  items: ShoppingCartItem[]
  isShoppingCartModalOpen: boolean
}

export const ShoppingCartContext = createContext({} as ShoppingCartContextData)

const initialShoppingCartState: ShoppingCartState = {
  items: [],
  isShoppingCartModalOpen: false,
}

enum ShoppingCartReducerActions {
  ADD_ITEM_TO_CART = 'ADD_ITEM_TO_CART',
  REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART',
  OPEN_SHOPPING_CART = 'OPEN_SHOPPING_CART',
  CLOSE_SHOPPING_CART = 'CLOSE_SHOPPING_CART',
}

type ShoppingCartReducerAction =
  | {
      type: ShoppingCartReducerActions.ADD_ITEM_TO_CART
      data: { id: string; priceId: string }
    }
  | {
      type: ShoppingCartReducerActions.REMOVE_ITEM_FROM_CART
      data: { id: string }
    }
  | {
      type: ShoppingCartReducerActions.OPEN_SHOPPING_CART
    }
  | {
      type: ShoppingCartReducerActions.CLOSE_SHOPPING_CART
    }

function ShoppingCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    (state: ShoppingCartState, action: ShoppingCartReducerAction) => {
      switch (action.type) {
        case ShoppingCartReducerActions.ADD_ITEM_TO_CART:
          return produce(state, (draft) => {
            draft.isShoppingCartModalOpen = true

            const itemAlreadyExists = draft.items.find(
              (item) => item.id === action.data.id,
            )

            if (itemAlreadyExists) return

            draft.items.push({
              id: action.data.id,
              priceId: action.data.priceId,
            })
          })
        case ShoppingCartReducerActions.REMOVE_ITEM_FROM_CART:
          return produce(state, (draft) => {
            const itemIndex = draft.items.findIndex(
              (item) => item.id === action.data.id,
            )

            if (itemIndex === -1) return

            draft.items.splice(itemIndex, 1)
            draft.isShoppingCartModalOpen = true
          })
        case ShoppingCartReducerActions.OPEN_SHOPPING_CART:
          return produce(state, (draft) => {
            draft.isShoppingCartModalOpen = true
          })
        case ShoppingCartReducerActions.CLOSE_SHOPPING_CART:
          return produce(state, (draft) => {
            draft.isShoppingCartModalOpen = false
          })
        default:
          return state
      }
    },
    initialShoppingCartState,
  )

  const { items, isShoppingCartModalOpen } = state

  function addItemToCart(id: string, priceId: string) {
    dispatch({
      type: ShoppingCartReducerActions.ADD_ITEM_TO_CART,
      data: { id, priceId },
    })
  }

  function removeItemFromCart(id: string) {
    dispatch({
      type: ShoppingCartReducerActions.REMOVE_ITEM_FROM_CART,
      data: { id },
    })
  }

  function openShoppingCart() {
    dispatch({ type: ShoppingCartReducerActions.OPEN_SHOPPING_CART })
  }

  function closeShoppingCart() {
    dispatch({ type: ShoppingCartReducerActions.CLOSE_SHOPPING_CART })
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        items,
        isShoppingCartModalOpen,
        addItemToCart,
        removeItemFromCart,
        closeShoppingCart,
        openShoppingCart,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  )
}

export const useShoppingCart = () => useContext(ShoppingCartContext)

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
            <Header>
              <Link href="/" passHref>
                <a>
                  <Image
                    src="/logo.svg"
                    alt="Logotipo"
                    width={130}
                    height={52}
                  />
                </a>
              </Link>

              <BagButton>
                <Bag size={24} />
              </BagButton>
            </Header>

            <Component {...pageProps} />
          </Container>
        </ShoppingCartProvider>
      </Hydrate>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
