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
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}products/${id}`
        );
        const data: ProductProps = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleBuy = () => {
    if (!isAuthenticated()) {
      router.push(`/login?redirect=/product/${id}`);
      return;
    }
    console.log("Comprar produto:", product);
  };

  function search(query: string) {
    router.push(`/search/${query}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)]">
        <NavBar onSearch={search} />
        <div className="max-w-6xl mx-auto px-4 mt-10 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="w-full h-80 bg-[var(--bg-soft)] rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-[var(--bg-soft)] rounded" />
              <div className="h-4 w-full bg-[var(--bg-soft)] rounded" />
              <div className="h-4 w-5/6 bg-[var(--bg-soft)] rounded" />
              <div className="h-10 w-32 bg-[var(--bg-soft)] rounded mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <NavBar onSearch={search} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Card da imagem */}
          <div className="rounded-2xl flex items-center justify-center">
            <img
              src={product?.photo || "https://i.postimg.cc/pXsJJ92z/526867-200.png"}
              alt={product?.name}
              className="max-h-80 object-contain"
            />
          </div>

          {/* Detalhes do produto */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-[var(--text-dark)]">
              {product?.name}
            </h1>
            <p className="text-[var(--text-secondary)]">(Futura Descrição)</p>
            <span className="text-2xl font-semibold text-[var(--success)]">
              R$ {product?.price}
            </span>

            <button
              onClick={handleBuy}
              className="mt-6 px-8 py-3 w-full hover:opacity-70 cursor-pointer hover:-translate-y-1.5 rounded-xl text-[var(--text-main)] bg-[var(--primary-color)] transition"
            >
              Comprar
            </button>

            <CartButton product={product!} />
          </div>
        </div>
      </div>

      {/* Drawers */}
      <AnimatePresence>{menu.isOpen && <MenuDrawer />}</AnimatePresence>
      <AnimatePresence>{cart.isOpen && <CartDrawer />}</AnimatePresence>

      <Footer />
    </div>
  );
}