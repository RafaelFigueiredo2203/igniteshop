import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react'

export interface Product {
  quantity: number
  id: string
  imageUrl: string
  name: string
  price: number
}

interface CartContextType {
  productsBuy: Product[]
  setProductsBuy: Dispatch<SetStateAction<Product[]>>
  total: number
  totalOfProductsOnCart: number
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [productsBuy, setProductsBuy] = useState<Product[]>([])
  const total = productsBuy.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  )

  const totalOfProductsOnCart = productsBuy.reduce(
    (total, product) => total + product.quantity,
    0,
  )

  console.log(total)

  return (
    <CartContext.Provider
      value={{
        productsBuy,
        setProductsBuy,
        total,
        totalOfProductsOnCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
