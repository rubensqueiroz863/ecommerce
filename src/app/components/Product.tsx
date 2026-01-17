import { ProductProps } from "../types/product";

export default function Product({ id, name, price  }: ProductProps) {
  return (
    <div className="flex flex-col p-2 bg-(--bg-card)">
      <p className="text-(--text-main)">{name}</p>
      <p className="text-(--success)">{price}</p>
    </div>
  )
}