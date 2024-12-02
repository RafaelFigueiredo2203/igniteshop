import { styled } from '..'

export const HomeContainer = styled('main', {
  display: 'flex',

  marginLeft: 'auto',
  paddingRight: 0,
  paddingBottom: 30,

  maxWidth: 'calc(100vw - ((100vw - 1180px)/ 2))',
})

export const Product = styled('div', {
  marginLeft: 10,
  marginTop: 50,
  background: 'linear-gradient(180deg, #1ea483 0%, #7465d4 100%)',
  borderRadius: 8,
  height: 'fit-content',

  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  img: {
    objectFit: 'cover',
  },

  footer: {
    cursor: 'auto',
    position: 'absolute',
    bottom: '0.25rem',
    left: '0.25rem',
    right: '0.25rem',
    padding: '1rem',

    borderRadius: 6,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: 'rgba(0, 0, 0, 0.6)',

    transform: 'translateY(110%)',
    opacity: 0,
    transition: 'all 0.2s ease-in-out',

    div: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      justifyContent: 'start',
    },

    strong: {
      fontSize: '$lg',
      color: '$gray100',
    },

    span: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '$green300',
      marginTop: 5,
    },

    button: {
      width: 46,
      height: 46,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      border: 0,
      backgroundColor: '#00875F',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.5,
      },
    },
  },

  '&:hover': {
    footer: {
      transform: 'translateY(0%)',
      opacity: 1,
    },
  },
})
