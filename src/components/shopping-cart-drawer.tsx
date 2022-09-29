import axios from 'axios'
import Image from 'next/image'
import { X } from 'phosphor-react'
import { useMemo } from 'react'
import Drawer from 'react-modern-drawer'

import { css } from '@stitches/react'
import { useMutation } from '@tanstack/react-query'

import { useShoppingCart } from '../contexts'
import { styled } from '../styles'
import { useProducts } from '../utils/use-products'

const drawer = css({
  width: '480px !important',
})

const Container = styled('div', {
  height: '100%',
  background: '$gray800',
  padding: '3rem',
  paddingTop: '4.5rem',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
})

const CloseButton = styled('button', {
  color: '$gray500',
  lineHeight: 0,
  background: 'transparent',
  border: 'none',
  position: 'absolute',
  top: '1.75rem',
  right: '3rem',
  zIndex: '99',
})

const ItemsList = styled('ul', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  marginTop: '2rem',

  li: {
    display: 'flex',
    gap: '1.25rem',
  },

  span: {
    color: '$gray300',
  },

  strong: {
    color: '$gray100',
    display: 'block',
  },

  button: {
    background: 'transparent',
    border: 'none',
    display: 'block',
    fontWeight: 'bold',
    color: '$green500',
    cursor: 'pointer',
    marginTop: '1rem',
  },
})

const ImgContainer = styled('div', {
  width: 102,
  height: 93,
  background: 'linear-gradient(180deg, #1EA483 0%, #7465D4 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  img: {
    objectFit: 'cover',
  },
})

const BuyButton = styled('button', {
  border: 'none',
  background: '$green500',
  color: '$white',
  fontWeight: 'bold',
  width: '100%',
  padding: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'background 0.2s ease',
  marginTop: '1.5rem',
  borderRadius: 6,

  '&:hover:not(:disabled)': {
    background: '$green300',
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
})

const SpacedBetweenContainer = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
})

export function ShoppingCartDrawer() {
  const {
    isShoppingCartModalOpen,
    closeShoppingCart,
    items,
    removeItemFromCart,
    cleanShoppingCart,
  } = useShoppingCart()

  const { data: products } = useProducts()

  const shoppingCartProducts = useMemo(
    () =>
      products
        ? products.filter(
            (product) => !!items.find((item) => item.id === product.id),
          )
        : [],
    [products, items],
  )

  const total = shoppingCartProducts.reduce((acc, product) => {
    acc += product.price
    return acc
  }, 0)

  const { isLoading: isCreatingCheckout, mutateAsync: createCheckout } =
    useMutation(
      async () => {
        const { data } = await axios.post<{ checkoutUrl: string }>(
          '/api/checkout',
          {
            products: shoppingCartProducts,
          },
        )

        return data
      },
      {
        onSuccess: (data) => {
          cleanShoppingCart()

          window.location.href = data.checkoutUrl
        },
      },
    )

  return (
    <Drawer
      open={isShoppingCartModalOpen}
      onClose={closeShoppingCart}
      direction="right"
      className={drawer()}
    >
      <CloseButton onClick={closeShoppingCart}>
        <X size={24} />
      </CloseButton>

      <Container>
        <h2>Sacola de compras</h2>

        <ItemsList>
          {shoppingCartProducts.map((product) => (
            <li key={product.id}>
              <ImgContainer>
                <Image
                  src={product.coverUrl}
                  alt={product.name}
                  width={94}
                  height={94}
                />
              </ImgContainer>

              <div>
                <span>{product.name}</span>
                <strong>
                  {new Intl.NumberFormat('pt-BR', {
                    currency: 'BRL',
                    style: 'currency',
                  }).format(product.price)}
                </strong>
                <button onClick={() => removeItemFromCart(product.id)}>
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ItemsList>

        <SpacedBetweenContainer>
          <span>Quantidade</span>
          <span>{shoppingCartProducts.length} itens</span>
        </SpacedBetweenContainer>

        <SpacedBetweenContainer>
          <strong>Valor total</strong>
          <strong>
            {new Intl.NumberFormat('pt-BR', {
              currency: 'BRL',
              style: 'currency',
            }).format(total)}
          </strong>
        </SpacedBetweenContainer>

        <BuyButton
          disabled={isCreatingCheckout || shoppingCartProducts.length === 0}
          onClick={() => createCheckout()}
        >
          Finalizar compra
        </BuyButton>
      </Container>
    </Drawer>
  )
}
