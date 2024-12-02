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

export function ModalDrawer() {
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
              newPrice: products.price * (products.quantity + 1),
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
              quantity: products.quantity > 1 ? products.quantity - 1 : 1,
              newPrice:
                products.price *
                (products.quantity > 1 ? products.quantity - 1 : 1),
            }
          : products,
      ),
    )
    localStorage.setItem('cart', JSON.stringify(productsBuy))
  }

  function handleProductRemove(id: string) {
    const productIndex = productsBuy.findIndex((product) => product.id === id)

    if (productIndex !== -1) {
      const filterProducts = [...productsBuy]
      filterProducts.splice(productIndex, 1)

      setProductsBuy(filterProducts)
      localStorage.setItem('cart', JSON.stringify(filterProducts))
      notify()
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
        window.location.href = data.url
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
            <div className=" min-h-64 max-h-24  overflow-y-auto  max-680:max-h-14">
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
                <span className="text-base font-normal text-gray-200 max-680:text-sm">
                  Quantidade
                </span>
                <span className="text-base font-normal text-gray-200 max-680:text-sm">
                  {totalOfProductsOnCart} itens
                </span>
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <span className="text-lg font-bold text-gray-200 max-680:text-base">
                  Valor total
                </span>
                <span className="text-2xl font-bold text-gray-200 max-680:text-xl">
                  {FormatCurrency(total)}
                </span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              className="h-16 bg-[#00875F] flex items-center justify-center bottom-0 hover:opacity-40"
            >
              <span className="text-lg font-bold text-white max-680:text-base">
                Finalizar Compra
              </span>
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
