import Image from 'next/image'
import Link from 'next/link'
import { Bag } from 'phosphor-react'

import { useShoppingCart } from '../contexts'
import { styled } from '../styles'

const Container = styled('header', {
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
  position: 'relative',

  '&:hover': {
    background: '$green500',
    color: '$white',
  },

  span: {
    position: 'absolute',
    top: -10,
    right: -10,
    borderRadius: '50%',
    background: '$green300',
    color: '$white',
    width: 24,
    height: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export function Header() {
  const { openShoppingCart, items } = useShoppingCart()

  return (
    <Container>
      <Link href="/" passHref>
        <a>
          <Image src="/logo.svg" alt="Logotipo" width={130} height={52} />
        </a>
      </Link>

      <BagButton onClick={openShoppingCart}>
        <Bag size={24} />

        {items.length > 0 && <span>{items.length}</span>}
      </BagButton>
    </Container>
  )
}
