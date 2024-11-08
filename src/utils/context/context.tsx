import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react'

export interface Product {
  id: string
  imageUrl: string
  name: string
  price: string | number
}

interface CartContextType {
  productsBuy: Product[]
  setProductsBuy: Dispatch<SetStateAction<Product[]>>
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [productsBuy, setProductsBuy] = useState<Product[]>([])

  return (
    <CartContext.Provider
      value={{
        productsBuy,
        setProductsBuy,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
