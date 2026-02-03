"use client";

import { useCart } from "@/lib/cart";
import { ProductProps } from "../types/product";

type CartButtonProps = {
  product: ProductProps;
};

export default function CartButton({ product }: Readonly<CartButtonProps>) {
  const { addProduct, isOnCart } = useCart();
  
  const handleAdd = () => {
    if (isOnCart(product)) {
      alert(`${product.name} já está no carrinho de compras.`);
    } else {
      alert(`${product.name} adicionado ao carrinho de compras.`);
    }
    addProduct(product);
  };
  
  return (
    <button
      onClick={handleAdd}
      className="cursor-pointer w-full px-8 py-3 text-(--text-main) bg-(--bg-card) rounded-xl not-last:over:opacity-90 transition"
    >
      Adicionar ao carrinho
    </button>
  );
}