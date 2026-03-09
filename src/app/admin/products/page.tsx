"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { useAdminMenu } from "@/lib/menu";
import { PageResponse } from "@/app/types/pageResponse";
import { SubCategoryProps } from "@/app/types/subCategory";
import SubCategory from "@/app/components/SubCategory";
import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";

export default function ProductsAdmin() {
  const [subCategories, setSubCategories] = useState<SubCategoryProps[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const menu = useAdminMenu();

  // Detecta se está visível na tela (sentinela para infinite scroll)
  const { ref, inView } = useInView({ threshold: 0 });

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

  useEffect(() => {
    fetchSubCategories();
  }, []);

  useEffect(() => {
    if (inView) fetchSubCategories();
  }, [inView, fetchSubCategories]);


  return (
    <div className="w-full">
      {/* Subcategorias */}
      <AnimatePresence>
        {subCategories.map(subCategory => (
          <SubCategory
            key={`sub-${subCategory.id}`} // Prefixo evita conflito de keys
            id={subCategory.id}
            name={subCategory.name}
            slug={subCategory.slug}
            role="admin"
          />
        ))}
      </AnimatePresence>
      
      <AnimatePresence>{menu.isOpen && <AdminMenuDrawer />}</AnimatePresence>
      {/* Sentinela Infinite Scroll */}
      {hasMore && (
        <div
          ref={ref}
          className="py-4 mb-125 text-center text-sm text-gray-400"
        >
          {loading ? "Carregando..." : "Carregando mais..."}
        </div>
      )}
      <div className="w-full h-px bg-(--soft-border) mt-30 md:mt-35" />
    </div>
  );
}