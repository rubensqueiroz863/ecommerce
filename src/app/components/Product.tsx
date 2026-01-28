import Image from "next/image";
import { ProductProps } from "../types/product";

export default function Product({ id, name, price, photo, width  }: ProductProps) {
 
  return (
    // Card do produto
    <div className={`flex flex-col ${width} mb-4 bg-(--bg-card) rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden`}>
      { /* Foto do produto */}
      <div className="flex items-center justify-center bg-white p-4">
        <Image
          src={photo}
          width={800}
          height={800}
          alt="Product photo"
          className="h-56 w-auto object-contain"
        />
      </div>
      { /* Nome e preço */}
      <div className="flex flex-col gap-1 p-4">
        <p className="text-(--text-main) font-medium line-clamp-2">
          {name}
        </p>

        <p className="text-(--success) font-semibold text-lg">
          R$ {price}
        </p>
      </div>
    </div>
  )
}