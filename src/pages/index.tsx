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
import { useEffect } from 'react'
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

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  })

  const notify = () => toast.success('Adicionado!', { autoClose: 2000 })

  function addToBag(id: string) {
    // Encontra o índice do produto no carrinho
    const existingProductIndex = productsBuy.findIndex((p) => p.id === id)

    let updatedProducts

    if (existingProductIndex !== -1) {
      // Produto já está no carrinho: atualiza a quantidade
      updatedProducts = [...productsBuy]
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        quantity: updatedProducts[existingProductIndex].quantity + 1,
      }
    } else {
      // Procura o produto na lista de produtos disponíveis
      const productToAdd = products.find((p) => p.id === id)

      if (productToAdd) {
        // Adiciona o produto ao carrinho com `quantity: 1`
        updatedProducts = [...productsBuy, { ...productToAdd, quantity: 1 }]
      } else {
        // Produto não encontrado, retorna sem fazer nada
        console.error(`Produto com ID "${id}" não encontrado.`)
        return
      }
    }

    // Atualiza o estado do carrinho e armazena no localStorage
    setProductsBuy(updatedProducts)
    localStorage.setItem('cart', JSON.stringify(updatedProducts))

    // Exibe notificação
    notify()
  }

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(productsBuy))
  }, [productsBuy])

  // Carrega o carrinho do localStorage ao montar o componente
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
      price: price.unit_amount / 100,
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2,
  }
}
