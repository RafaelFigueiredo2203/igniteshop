/* eslint-disable camelcase */
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useMyContext } from '@/utils/context/useContext'
import { FormatCurrency } from '@/utils/functions/formatCurrency'
import { Handbag, X } from 'phosphor-react'
import { toast } from 'react-toastify'
import { ProductCard } from './ProductCard'

export default function ModalDrawer() {
  const { productsBuy, setProductsBuy, total, totalOfProductsOnCart } =
    useMyContext()

  const notify = () => toast.success('Removido!', { autoClose: 2000 })

  function handleIncreaseProduct(id: string) {
    setProductsBuy((prevProducts) =>
      prevProducts.map((products) =>
        products.id === id
          ? {
              ...products,
              quantity: products.quantity + 1,
              newPrice: products.price * (products.quantity + 1), // Calcula com base na nova quantidade
            }
          : products,
      ),
    )
    localStorage.setItem('cart', JSON.stringify(productsBuy))
  }

  function handleDecreaseProduct(id: string) {
    setProductsBuy((prevProducts) =>
      prevProducts.map((products) =>
        products.id === id
          ? {
              ...products,
              quantity: products.quantity > 1 ? products.quantity - 1 : 1, // Evita quantidade negativa
              newPrice:
                products.price *
                (products.quantity > 1 ? products.quantity - 1 : 1), // Calcula com base na nova quantidade
            }
          : products,
      ),
    )
    localStorage.setItem('cart', JSON.stringify(productsBuy))
  }

  function handleProductRemove(id: string) {
    const productIndex = productsBuy.findIndex((product) => product.id === id)

    if (productIndex !== -1) {
      // Verifica se o produto foi encontrado
      const filterProducts = [...productsBuy] // Cria uma cópia do array de produtos
      filterProducts.splice(productIndex, 1) // Remove o produto do array

      setProductsBuy(filterProducts) // Atualiza o estado com o novo array de produtos

      localStorage.setItem('cart', JSON.stringify(filterProducts))
      notify() // Atualiza o armazenamento local
    }
  }

  async function handleCheckout() {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productsBuy }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url // Redireciona para o checkout da Stripe
      } else {
        console.error('Erro ao criar sessão de checkout:', data.error)
      }
    } catch (error) {
      console.error('Erro ao processar checkout:', error)
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {productsBuy.length > 0 ? (
          <Button
            className="relative marker:disabled:cursor-not-allowed"
            variant="outline"
            disabled={productsBuy.length <= 0}
          >
            <Handbag size={24} color="white" weight="bold" />
            <span className="white font-bold text-xs absolute right-0 bottom-0">
              {productsBuy.length}
            </span>
          </Button>
        ) : (
          <></>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <div className="w-full  flex items-center justify-end">
              <DrawerClose asChild>
                <Button className="w-6 flex items-center justify-center rounded-full hover:border border-gray-300">
                  <X size={24} color="#8D8D99" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerTitle>Sacola de compras</DrawerTitle>
          </DrawerHeader>

          {productsBuy.length === 0 ? (
            <>
              <span>Adicione produtos ao carrinho</span>
            </>
          ) : (
            <div className=" min-h-80 max-h-80  overflow-y-scroll">
              {productsBuy.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.imageUrl}
                  name={product.name}
                  quantity={product.quantity}
                  price={FormatCurrency(product.price)}
                  onRemove={() => handleProductRemove(product.id)}
                  onDecreaseQuantity={() => handleDecreaseProduct(product.id)}
                  onIncreaseQuantity={() => handleIncreaseProduct(product.id)}
                />
              ))}
            </div>
          )}

          <DrawerFooter>
            <div className="flex flex-col items-center justify-between">
              <div className="w-full flex flex-row items-center justify-between">
                <span className="text-base font-normal text-gray-200">
                  Quantidade
                </span>
                <span className="text-base font-normal text-gray-200">
                  {totalOfProductsOnCart} itens
                </span>
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <span className="text-lg font-bold text-gray-200">
                  Valor total
                </span>
                <span className="text-2xl font-bold text-gray-200">
                  {FormatCurrency(total)}
                </span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              className="h-16 bg-[#00875F] flex items-center justify-center bottom-0 hover:opacity-40"
            >
              <span className="text-lg font-bold text-white">
                Finalizar Compra
              </span>
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
