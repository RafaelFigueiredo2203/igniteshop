import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react'

export interface Product {
  id: string
  id_local: number
  stripe_id: string
  imageUrl: string
  name: string
  price: number
}

interface CartContextType {
  productsBuy: Product[]
  setProductsBuy: Dispatch<SetStateAction<Product[]>>
  total: number
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [productsBuy, setProductsBuy] = useState<Product[]>([])
  const total = productsBuy.reduce(
    (accumulator, product) => accumulator + (Number(product.price) || 0),
    0,
  )
  console.log(total)

  return (
    <CartContext.Provider
      value={{
        productsBuy,
        setProductsBuy,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
