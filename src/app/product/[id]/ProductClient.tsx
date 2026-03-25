"use client";

import CartButton from "@/app/components/CartButton";
import CartDrawer from "@/app/components/CartDrawer";
import Footer from "@/app/components/Footer";
import MenuDrawer from "@/app/components/MenuDrawer";
import NavBar from "@/app/components/NavBar";
import { ProductClientProps, ProductProps } from "@/app/types/product";
import { useCart } from "@/lib/cart";
import { isAuthenticated } from "@/lib/getAuthenticated";
import { useMenu } from "@/lib/menu";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductClient({ id }: Readonly<ProductClientProps>) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductProps | null>(null);

  const router = useRouter();
  const menu = useMenu();
  const cart = useCart();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}products/${id}`
      )

      const data: ProductProps = await res.json();

      setProduct(data);
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  function search(query: string) {
    router.push(`/search/${query}`);
  }

  const handleBuy = () => {
    if (!isAuthenticated()) {
      router.push(`/login?redirect=/product/${id}`);
      return;
    }

    console.log("Comprar produto:", product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main)">
        <NavBar onSearch={search} />
        <div className="max-w-6xl mx-auto px-4 mt-10 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="w-full h-80 bg-gray-300 rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-300 rounded" />
              <div className="h-4 w-full bg-gray-300 rounded" />
              <div className="h-4 w-5/6 bg-gray-300 rounded" />
              <div className="h-10 w-32 bg-gray-300 rounded mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-main)">
      <NavBar onSearch={search} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl shadow-sm flex items-center justify-center p-6">
            <img
              src={"https://i.postimg.cc/pXsJJ92z/526867-200.png"}
              alt={product?.name}
              className="max-h-80 object-contain"
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-(--text-main)">
              {product?.name}
            </h1>
            <p className="text-gray-500">
              Description
            </p>
            <span className="text-2xl font-semibold text-green-600">
              R$ {product?.price}
            </span>
            <button
              onClick={handleBuy}
              className="cursor-pointer mt-6 px-8 py-3 bg-green-600 w-full text-(--text-main) rounded-xl hover:opacity-90 transition"
            >
              Buy
            </button>
            <CartButton product={product!} />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {menu.isOpen && <MenuDrawer />}
      </AnimatePresence>
      <AnimatePresence>
        {cart.isOpen && <CartDrawer />}
      </AnimatePresence>
      <div className="w-full h-px bg-(--soft-border) mt-30 md:mt-35" />
      <Footer />
    </div>
  );
}