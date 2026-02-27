"use client";

import CartButton from "@/app/components/CartButton";
import CartDrawer from "@/app/components/CartDrawer";
import Footer from "@/app/components/Footer";
import MenuDrawer from "@/app/components/MenuDrawer";
import NavBar from "@/app/components/NavBar";
import { ProductProps } from "@/app/types/product";
import { useCart } from "@/lib/cart";
import { useMenu } from "@/lib/menu";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  id: string;
};

function isAuthenticated() {
  if (globalThis.window === undefined) return false;

  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    }

    return !isExpired;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export default function ProductClient({ id }: Readonly<Props>) {
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
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/${id}`
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
            {/* Imagem */}
            <div className="w-full h-80 bg-gray-300 rounded-xl" />

            {/* Infos */}
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
          
          {/* Imagem do produto */}
          <div className="bg-white rounded-2xl shadow-sm flex items-center justify-center p-6">
            <img
              src={"https://i.postimg.cc/pXsJJ92z/526867-200.png"}
              alt={product?.name}
              className="max-h-80 object-contain"
            />
          </div>

          {/* Informações */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-(--text-main)">
              {product?.name}
            </h1>

            <p className="text-gray-500">
              Descrição
            </p>

            <span className="text-2xl font-semibold text-green-600">
              R$ {product?.price}
            </span>
            <button
              onClick={handleBuy}
              className="cursor-pointer mt-6 px-8 py-3 bg-green-600 w-full text-(--text-main) rounded-xl hover:opacity-90 transition"
            >
              Comprar
            </button>
            <CartButton product={product!} />
          </div>
        </div>
      </div>
      { /* Menu drawer */}
      <AnimatePresence>
        {menu.isOpen && <MenuDrawer />}
      </AnimatePresence>
      { /* Cart drawer */}
      <AnimatePresence>
        {cart.isOpen && <CartDrawer />}
      </AnimatePresence>
      <div className="w-full h-px bg-(--soft-border) mt-30 md:mt-35" />
      <Footer />
    </div>
  );

}