import { stripe } from '@/lib/stripe'
import { HomeContainer, Product } from '@/styles/pages/home'
import { useMyContext } from '@/utils/context/useContext'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Handbag } from 'phosphor-react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import Stripe from 'stripe'

interface HomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: number
  }[]
}

export default function Home({ products }: HomeProps) {
  const { productsBuy, setProductsBuy } = useMyContext()

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  })
  console.log(products)
  const notify = () => toast.success('Adicionado!', { autoClose: 2000 })

  function addToBag(id: string) {
    const newProductBuy = products.find((x: { id: string }) => x.id === id)

    if (!newProductBuy) {
      return
    }

    setProductsBuy((prevState) => [...prevState, newProductBuy])

    // Atualizar o local storage com o novo estado do carrinho
    localStorage.setItem('cart', JSON.stringify(productsBuy))
    notify()
  }

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(productsBuy))
  }, [productsBuy])

  useEffect(() => {
    const productsJSON = localStorage.getItem('cart')
    const products = productsJSON ? JSON.parse(productsJSON) : []
    setProductsBuy(products)
  }, [setProductsBuy])

  return (
    <>
      <Head>
        <title>Ignite Shop</title>
      </Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map((product) => {
          return (
            <Product key={product.id} className="keen-slider__slide">
              <Link href={`/product/${product.id}`} prefetch={false}>
                <Image src={product.imageUrl} width={520} height={480} alt="" />
              </Link>
              <footer>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </div>

                <button
                  onClick={() => addToBag(product.id)}
                  className="bg-black"
                >
                  <Handbag size={24} color="white" weight="bold" />
                </button>
              </footer>
            </Product>
          )
        })}
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  })

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(price.unit_amount) / 100),
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2,
  }
}
