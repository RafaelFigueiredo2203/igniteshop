import { stripe } from '@/lib/stripe'
import { ImageContainer, SuccessContainer } from '@/styles/pages/success'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Stripe from 'stripe'

interface SuccessProps {
  customerName: string
  products: [
    {
      id: string
      imageUrl: string
      name: string
    },
  ]
}

export default function Success({ customerName, products }: SuccessProps) {
  console.log(products)
  return (
    <SuccessContainer>
      <Head>
        <title>Sucesso ao Comprar!</title>

        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex flex-row items-center justify-center relative ml-11">
        {products?.map((item) => (
          <ImageContainer key={item.id} className="rounded-full">
            <Image src={item.imageUrl} width={120} height={110} alt="" />
          </ImageContainer>
        ))}
      </div>
      <h1>Compra Efetuada!</h1>

      <p>
        Uhuul <strong>{customerName}</strong>, sua{' '}
        {products.map((item) => (
          <strong key={item.id}>{item.name}, </strong>
        ))}{' '}
        já está a caminho da sua casa.
      </p>

      <Link href="/">Voltar ao Catálogo</Link>
    </SuccessContainer>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  })

  const customerName = session?.customer_details?.name

  const products = session.line_items?.data.map((item) => {
    const product = item.price?.product as Stripe.Product

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
    }
  })

  return {
    props: {
      customerName,
      products,
    },
  }
}
