"use client";

import { useEffect, useState, useCallback } from "react";
import NavBar from "./components/NavBar";
import { SubCategoryProps } from "./types/subCategory";
import SubCategory from "./components/SubCategory";
import { useRouter } from "next/navigation";
import { useMenu } from "@/lib/menu";
import MenuDrawer from "./components/MenuDrawer";
import { AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

type PageResponse<T> = {
  data: T[];
  hasMore: boolean;
};

export default function HomePage() {
  const [subCategories, setSubCategories] = useState<SubCategoryProps[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const menu = useMenu();

  // Detecta se está visivel na tela
  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Fetch das subcategorias
  const fetchSubCategories = useCallback(async () => {
    // detecta se está carregando ou se não tem mais
    if (loading || !hasMore) return;

    setLoading(true);

    // Tenta fazer o fetch das subcategorias
    try {
      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/subcategories?page=${page}&size=6`
      );
      // Converte para json
      const data: PageResponse<SubCategoryProps> = await res.json();
      // Pega a data com as subcategorias e se tem main
      setSubCategories(prev => [...prev, ...data.data]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      // Erro no fetch
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);
  
  // Chama o fetch
  useEffect(() => {
    fetchSubCategories();
  }, []);

  // Caso visivel, chama mais categorias
  useEffect(() => {
    if (inView) {
      fetchSubCategories();
    }
  }, [inView, fetchSubCategories]);

  function search(query: string) {
    router.push(`/search/${query}`);
  }

  return (
    // Homepage
    <div className="w-full">
      { /* NavBar */}
      <NavBar onSearch={search} />

      <ul
        className="
          flex
          flex-col
          gap-3
          w-full
          px-2
          py-2
        "
      >
        { /* SubCategorias com animação */}
        <AnimatePresence>
          {subCategories.map(subCategory => (
            <SubCategory
              key={subCategory.id}
              id={subCategory.id}
              name={subCategory.name}
              slug={subCategory.slug}
            />
          ))}
        </AnimatePresence>
      </ul>

      {/* 🔽 SENTINELA DO INFINITE SCROLL */}
      {hasMore && (
        <div ref={ref} className="py-4 text-center text-sm text-gray-400">
          {loading ? "Carregando..." : "Carregando mais..."}
        </div>
      )}
      { /* Menu drawer */}
      <AnimatePresence>
        {menu.isOpen && <MenuDrawer />}
      </AnimatePresence>
    </div>
  );
}
