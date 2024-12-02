import { stripe } from '@/lib/stripe'
import { HomeContainer, Product } from '@/styles/pages/home'
import { useMyContext } from '@/utils/context/useContext'
import { FormatCurrency } from '@/utils/functions/formatCurrency'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Handbag } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Stripe from 'stripe'

interface HomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: number
    quantity: number
  }[]
}

export default function Home({ products }: HomeProps) {
  const { setProductsBuy, productsBuy } = useMyContext()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Garante que o código será executado apenas no navegador
    if (typeof window !== 'undefined') {
      const handleResize = () => setIsMobile(window.innerWidth < 768)
      handleResize() // Atualiza o estado imediatamente
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  })

  const notify = () => toast.success('Adicionado!', { autoClose: 2000 })

  function addToBag(id: string) {
    const existingProductIndex = productsBuy.findIndex((p) => p.id === id)

    let updatedProducts

    if (existingProductIndex !== -1) {
      updatedProducts = [...productsBuy]
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        quantity: updatedProducts[existingProductIndex].quantity + 1,
      }
    } else {
      const productToAdd = products.find((p) => p.id === id)

      if (productToAdd) {
        updatedProducts = [...productsBuy, { ...productToAdd, quantity: 1 }]
      } else {
        console.error(`Produto com ID "${id}" não encontrado.`)
        return
      }
    }

    setProductsBuy(updatedProducts)
    localStorage.setItem('cart', JSON.stringify(updatedProducts))

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

  useEffect(() => {
    // Garante que o código será executado apenas no navegador
    if (typeof window !== 'undefined') {
      const handleResize = () => setIsMobile(window.innerWidth < 768)
      handleResize() // Atualiza o estado imediatamente
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Ignite Shop</title>
      </Head>
      {isMobile ? (
        <div className="flex flex-col items-center justify-start px-4 pb-16">
          {products.map((product) => {
            return (
              <Product key={product.id} className="keen-slider__slide md:">
                <Link href={`/product/${product.id}`} prefetch={false}>
                  <Image
                    src={product.imageUrl}
                    width={520}
                    height={480}
                    alt=""
                  />
                </Link>
                <footer>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{FormatCurrency(product.price)}</span>
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
        </div>
      ) : (
        <HomeContainer ref={sliderRef} className="keen-slider">
          {products.map((product) => {
            return (
              <Product key={product.id} className="keen-slider__slide md:">
                <Link href={`/product/${product.id}`} prefetch={false}>
                  <Image
                    src={product.imageUrl}
                    width={520}
                    height={480}
                    alt=""
                  />
                </Link>
                <footer>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{FormatCurrency(product.price)}</span>
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
      )}
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
      price: Number(price.unit_amount) / 100,
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2,
  }
}
