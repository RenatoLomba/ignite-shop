import type { NextPage } from 'next'

import { styled } from '../styles'

const Button = styled('button', {
  backgroundColor: '$green500',
  color: 'White',
  border: 'none',
  padding: '0.5rem',
  borderRadius: 4,
  '&:hover': {
    filter: 'brightness(0.8)',
  },
})

const Home: NextPage = () => {
  return (
    <div>
      <h1>Hello world</h1>
      <Button>Teste</Button>
    </div>
  )
}

export default Home
