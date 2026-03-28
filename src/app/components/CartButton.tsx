"use client";

import { useCart } from "@/lib/cart";
import { CartButtonProps } from "../types/cart";

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
      className="w-full px-8 py-3 text-(--text-main) bg-(--bg-card) rounded-xl hover:opacity-70 cursor-pointer hover:-translate-y-1.5 transition"
    >
      Add to Cart
    </button>
  );
}