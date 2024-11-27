// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { stripe } from '@/lib/stripe'
import { Product } from '@/utils/context/context'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { productsBuy } = req.body

      // Transformar os produtos para o formato esperado pela Stripe
      const lineItems = productsBuy.map((product: Product) => ({
        price_data: {
          currency: 'usd', // Substitua pela moeda desejada
          product_data: {
            name: product.name,
            images: [product.imageUrl], // URL da imagem do produto
          },
          unit_amount: Math.round(product.price * 100), // Preço em centavos
        },
        quantity: product.quantity, // Quantidade do produto
      }))

      // Criar a sessão de checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // Métodos de pagamento aceitos
        line_items: lineItems,
        mode: 'payment', // Modo de pagamento único
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`, // URL de sucesso
        cancel_url: `${req.headers.origin}/cancel`, // URL de cancelamento
      })

      res.status(200).json({ url: session.url })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
