import Image from 'next/image'

interface ProductCardProps {
  image: string
  name: string
  price: string
  onRemove: () => void
}

export function ProductCard({
  image,
  name,
  onRemove,
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
        <p className="pl-1  text-lg font-normal text-[#C4C4CC]">{name}</p>
        <span className="pl-1 text-lg font-bold">{price}</span>
        <button
          onClick={onRemove}
          className="mt-2 text-[#00875F] p-1 rounded-lg hover:bg-red-600 hover:text-white"
        >
          Remover
        </button>
      </div>
    </div>
  )
}
