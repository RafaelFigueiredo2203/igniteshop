import { DrawerDemo } from '@/components/Modal'
import { Container, Header } from '@/styles/pages/app'
import { AppProps } from 'next/app'
import Image from 'next/image'
import logoImg from '../assets/logo.svg'
import { globalStyles } from '../styles/global'
import '../styles/index.css'

globalStyles()

function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Image src={logoImg} alt="" />
        <DrawerDemo />
      </Header>

      <Component {...pageProps} />
    </Container>
  )
}

export default App
