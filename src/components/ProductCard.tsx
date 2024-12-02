import Image from 'next/image'
import { Minus, Plus, Trash } from 'phosphor-react'
import { Button } from './ui/button'

interface ProductCardProps {
  image: string
  name: string
  price: string
  quantity: number

  onIncreaseQuantity: () => void
  onDecreaseQuantity: () => void
  onRemove: () => void
}

export function ProductCard({
  image,
  name,
  onRemove,
  onDecreaseQuantity,
  onIncreaseQuantity,
  quantity,
  price,
}: ProductCardProps) {
  return (
    <div className="w-full h-95 mt-6  flex flex-row items-center justify-start py-0">
      <Image
        width={95}
        height={95}
        src={image}
        alt="Imagem de produto "
        className="bg-custom-gradient rounded-lg"
      />

      <div className="w-full flex  flex-col mt-0 ml-4 items-start  justify-between">
        <p className="pl-1  text-lg font-normal text-[#C4C4CC] max-680:text-base">
          {name}
        </p>
        <span className="pl-1 text-lg font-bold max-680:text-base">
          {price}
        </span>
        <div className="flex flex-row">
          <div className=" mr-2 flex h-8 flex-row items-center rounded-sm  sm:w-16">
            <Button
              onClick={onDecreaseQuantity}
              className="flex h-8 items-center justify-center bg-transparent px-1 bg-gray-700 hover:bg-slate-800"
            >
              <Minus size={15} color="white" />
            </Button>
            <span className="flex items-center justify-center p-1">
              {quantity}
            </span>
            <Button
              onClick={onIncreaseQuantity}
              className="flex h-8 items-center justify-center bg-transparent px-1 bg-gray-700 hover:bg-slate-800"
            >
              <Plus size={15} color="white" />
            </Button>
          </div>

          <Button
            onClick={onRemove}
            className="flex h-8 items-center justify-center bg-gray-700  px-1 hover:bg-red-500  "
          >
            <Trash size={15} color="white" />
          </Button>
        </div>
      </div>
    </div>
  )
}
