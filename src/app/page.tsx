"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import NavBar from "./components/NavBar";
import SubCategory from "./components/SubCategory";
import Product from "./components/Product";
import MenuDrawer from "./components/MenuDrawer";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

import { SubCategoryProps } from "./types/subCategory";
import { ProductProps } from "./types/product";
import { PageResponse } from "./types/pageResponse";

import { useMenu } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";


interface MostClickedProductDTO {
  product: ProductProps;
  clicks: number;
}

export default function HomePage() {
  const [subCategories, setSubCategories] = useState<SubCategoryProps[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forYou, setForYou] = useState<MostClickedProductDTO[]>([]);

  const router = useRouter();
  const menu = useMenu();
  const cart = useCart();
  const { user } = useAuth();

  // Detecta se está visível na tela (sentinela para infinite scroll)
  const { ref, inView } = useInView({ threshold: 0 });

  // =========================
  // Fetch Subcategorias
  // =========================
  const fetchSubCategories = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/subcategories?page=${page}&size=6`
      );
      const data: PageResponse<SubCategoryProps> = await res.json();

      setSubCategories(prev => [...prev, ...data.data]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Erro ao buscar subcategorias:", err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  // =========================
  // Fetch Produtos Mais Clicados
  // =========================
  async function fetchMostClicked(userId: string, limit: number = 10) {
    try {
      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/events/analytics/users/${userId}/most-clicked?limit=${limit}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!res.ok) throw new Error(`Erro ao buscar produtos: ${res.status}`);
      const data: MostClickedProductDTO[] = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  // =========================
  // Carrega produtos "Para Você" quando o usuário está logado
  // =========================
  useEffect(() => {
    if (!user) return;

    async function loadForYou() {
      const data = await fetchMostClicked(user!.id, 10);
      setForYou(data);
    }

    loadForYou();
  }, [user?.id]);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (inView) fetchSubCategories();
  }, [inView, fetchSubCategories]);


  function search(query: string) {
    router.push(`/search/${query}`);
  }

  return (
    <div className="w-full">
      <NavBar onSearch={search} />
    
      {!!(forYou.length) && <ul className="flex flex-col gap-3 w-full px-2 py-2">
        {/* Produtos "Para Você" */}
        <motion.div
          className="px-10 w-full mt-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          { /* Nome */}
          <motion.h2
            className="text-xl font-bold mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Para você
          </motion.h2>
          <div className="flex gap-4 overflow-x-auto">
            {forYou.map(({ product, clicks }) => (
              <div key={`product-${product.id}`} className="flex flex-col items-start gap-1">
                {/* Mostra os clicks para teste: <span className="text-sm text-gray-500">Clicks: {clicks}</span> */}

                {/* Componente Product */}
                <Product
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  width="min-w-xs max-w-xs"
                  query=""
                  photo={product.photo || ""}
                />
              </div>
            ))}
          </div>
        </motion.div>
        
      </ul>}
      {/* Subcategorias */}
        <AnimatePresence>
          {subCategories.map(subCategory => (
            <SubCategory
              key={`sub-${subCategory.id}`} // ✅ Prefixo evita conflito de keys
              id={subCategory.id}
              name={subCategory.name}
              slug={subCategory.slug}
            />
          ))}
        </AnimatePresence>
      {/* Sentinela Infinite Scroll */}
      {hasMore && (
        <div
          ref={ref}
          className="py-4 mb-[500px] text-center text-sm text-gray-400"
        >
          {loading ? "Carregando..." : "Carregando mais..."}
        </div>
      )}

      {/* Drawers */}
      <AnimatePresence>{menu.isOpen && <MenuDrawer />}</AnimatePresence>
      <AnimatePresence>{cart.isOpen && <CartDrawer />}</AnimatePresence>

      <div className="w-full h-px bg-(--soft-border) mt-30 md:mt-35" />
      <Footer />
    </div>
  );
}