/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '@/styles/global'
import { Product } from '@/utils/context/context'
import { useMyContext } from '@/utils/context/useContext'
import { FormatCurrency } from '@/utils/functions/formatCurrency'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Stripe from 'stripe'
import { stripe } from '../../lib/stripe'

interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: number
    quantity: number
    description: string
    defaultPriceId: string
  }
}

export default function ProductPage({ product }: ProductProps) {
  const [isCreatingCheckoutSession] = useState(false)

  const { productsBuy, setProductsBuy } = useMyContext()
  const notify = () => toast.success('Adicionado!', { autoClose: 2000 })

  console.log(product)
  function addToBag(product: Product) {
    // Encontra o índice do produto no carrinho
    const existingProductIndex = productsBuy.findIndex(
      (p) => p.id === product.id,
    )

    let updatedProducts

    if (existingProductIndex !== -1) {
      // Produto já está no carrinho: atualiza a quantidade
      updatedProducts = [...productsBuy]
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        quantity: updatedProducts[existingProductIndex].quantity + 1,
      }
    } else {
      // Adiciona o produto ao carrinho com `quantity: 1`
      updatedProducts = [...productsBuy, { ...product, quantity: 1 }]
    }

    // Atualiza o estado do carrinho e armazena no localStorage
    setProductsBuy(updatedProducts)
    localStorage.setItem('cart', JSON.stringify(updatedProducts))

    // Exibe notificação
    notify()
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{FormatCurrency(product.price)}</span>

          <p>{product.description}</p>

          <button
            disabled={isCreatingCheckoutSession}
            onClick={() => addToBag(product)}
          >
            Colocar na sacola
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: 'prod_MLH5Wy0Y97hDAC' } }],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const productId = params?.id

  const product = await stripe.products.retrieve(productId as string, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: Number(price.unit_amount) / 100,
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hours
  }
}
