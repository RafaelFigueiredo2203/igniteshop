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
import { X } from 'phosphor-react'
import { ProductCard } from './ProductCard'

export function ModalDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
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
          <div className=" min-h-80 max-h-80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300 overflow-y-scroll">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </div>
          <DrawerFooter>
            <div className="flex flex-col items-center justify-between">
              <div className="w-full flex flex-row items-center justify-between">
                <span className="text-base font-normal text-gray-200">
                  Quantidade
                </span>
                <span className="text-base font-normal text-gray-200">
                  3 itens
                </span>
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <span className="text-lg font-bold text-gray-200">
                  Valor total
                </span>
                <span className="text-2xl font-bold text-gray-200">R$ 270</span>
              </div>
            </div>
            <Button className="h-16 bg-[#00875F] flex items-center justify-center bottom-0 hover:opacity-40">
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
