import { globalCss } from '@stitches/react'

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  'button:focus': {
    outline: '2px solid',
    outlineColor: '$green300',
  },

  body: {
    '-webkit-font-smoothing': 'antialiased',
    backgroundColor: '$gray900',
    color: '$gray100',
    lineHeight: 1.6,
  },

  'body, input, textarea, button': {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
  },

  a: {
    textDecoration: 'none',
  },

  ul: {
    listStyle: 'none',
  },

  button: {
    cursor: 'pointer',
  },
})
