import produce from 'immer'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react'

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
  cleanShoppingCart: () => void
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
  CLEAN_SHOPPING_CART = 'CLEAN_SHOPPING_CART',
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
  | {
      type: ShoppingCartReducerActions.CLEAN_SHOPPING_CART
    }

const shoppingCartReducer = (
  state: ShoppingCartState,
  action: ShoppingCartReducerAction,
) => {
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
    case ShoppingCartReducerActions.CLEAN_SHOPPING_CART:
      return produce(state, (draft) => {
        draft.items = []
        draft.isShoppingCartModalOpen = false
      })
    default:
      return state
  }
}

export function ShoppingCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    shoppingCartReducer,
    initialShoppingCartState,
    () => {
      const storedState = localStorage.getItem(
        '@ignite-shop:shopping-cart:1.0.0',
      )

      if (storedState) {
        return JSON.parse(storedState)
      }

      return initialShoppingCartState
    },
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

  function cleanShoppingCart() {
    dispatch({ type: ShoppingCartReducerActions.CLEAN_SHOPPING_CART })
  }

  useEffect(() => {
    localStorage.setItem(
      '@ignite-shop:shopping-cart:1.0.0',
      JSON.stringify(state),
    )
  }, [state])

  return (
    <ShoppingCartContext.Provider
      value={{
        items,
        isShoppingCartModalOpen,
        addItemToCart,
        removeItemFromCart,
        closeShoppingCart,
        openShoppingCart,
        cleanShoppingCart,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  )
}

export const useShoppingCart = () => useContext(ShoppingCartContext)
