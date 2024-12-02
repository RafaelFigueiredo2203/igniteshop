import { ModalDrawer } from '@/components/ModalDrawer'
import { Container, Header } from '@/styles/pages/app'
import { CartProvider } from '@/utils/context/context'
import { AppProps } from 'next/app'
import Image from 'next/image'
import Link from 'next/link'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import logoImg from '../assets/logo.svg'
import { globalStyles } from '../styles/global'
import '../styles/index.css'

globalStyles()

function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <CartProvider>
        <Header className="px-4">
          <Link href={'/'} prefetch={false}>
            <Image src={logoImg} alt="" />
          </Link>
          <ModalDrawer />
        </Header>

        <Component {...pageProps} />
        <ToastContainer />
      </CartProvider>
    </Container>
  )
}

export default App
