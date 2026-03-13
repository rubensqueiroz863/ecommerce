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
import CategoriesCard from "./components/CategoriesCard";
import PhoneCategoryCard from "./components/PhoneCategoryCard";

interface MostClickedProductDTO {
  product: ProductProps;
  clicks: number;
}

function ramdomKey(max: number): number {
  return Math.floor(Math.random() * max);
}

export interface UserRecommendation {
  productId: string;
  productName: string;
  productPrice: number;
  usersInCommon: number;
}

export interface UserRecommendationGroup {
  userId: string;
  userName: string;
  recommendations: UserRecommendation[];
}

export default function HomePage() {
  const [subCategories, setSubCategories] = useState<SubCategoryProps[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forYou, setForYou] = useState<MostClickedProductDTO[]>([]);
  const [userRecommendations, setRecommendations] = useState<UserRecommendationGroup | undefined>(undefined);

  const router = useRouter();
  const menu = useMenu();
  const cart = useCart();
  const { user } = useAuth();

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

  async function fetchMostClicked(userId: string, limit: number = 10) {
    console.log(userId);
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

  async function fetchRecommendations(userId: string) {
    try {
      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/events/user/recommendations/${userId}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!res.ok) throw new Error(`Erro ao buscar produtos: ${res.status}`);
      
      const data: UserRecommendationGroup = await res.json();
      
      return data;

    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
  useEffect(() => {
    if (!user) return;

    async function loadForYou() {
      const forYouData = await fetchMostClicked(user!.id, 10);
      const recommendationsData = await fetchRecommendations(user!.id);
      setForYou(forYouData);
      setRecommendations(recommendationsData);
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
      <div className="flex w-full gap-8 px-4 pt-4 md:pt-8 md:px-8">
        <div className="hidden md:block">
          <CategoriesCard />
        </div>
        <div className="flex xl:flex-row flex-col gap-2 items-center flex-1 justify-center xl:px-34 md:px-12">
          <PhoneCategoryCard />
          <div className="flex xl:hidden px-2 justify-between text-(--text-dark) w-full h-22 bg-(--bg-gray) rounded-2xl">
            {/* Free Shipping */}
            <div className="flex flex-row items-center gap-3">
              <svg width="24" height="24" className="text-(--primary-color)" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 3.66333L20.25 7.7398V17.01L12 21.0865L3.75 17.01V7.7398L12 3.66333ZM5.25 9.41292V16.078L11.25 19.0427V12.3776L5.25 9.41292ZM12.75 12.3776V19.0427L18.75 16.078V9.41292L16.5 10.5247V13.4999L15 14.2499V11.2659L12.75 12.3776ZM17.807 8.20577L15.8527 9.17139C15.8099 9.13606 15.7624 9.10498 15.7106 9.07908L10.1015 6.27454L12 5.33645L17.807 8.20577ZM8.41452 7.1081L14.1871 9.9944L12 11.0751L6.19304 8.20577L8.41452 7.1081Z" fill="currentColor"/>
              </svg>
              <div className="flex flex-col justify-center">
                <p className="font-medium text-[13px]">Free Shipping</p>
                <p className="text-(--text-muted) text-[12px]">On All Orders</p>
              </div>
            </div>

            {/* Online Support */}
            <div className="flex flex-row items-center gap-3">
              <svg width="24" height="24" className="text-(--primary-color)" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM11 6H13V13H11V6ZM11 16H13V18H11V16Z" fill="currentColor"/>
              </svg>
              <div className="flex flex-col justify-center">
                <p className="font-medium text-[13px]">Online Support</p>
                <p className="text-(--text-muted) text-[12px]">Technical 24/7</p>
              </div>
            </div>

            {/* User Safety */}
            <div className="flex flex-row items-center gap-3">
              <svg width="24" height="24" className="text-(--primary-color)" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.52 7.58 21 12 21C16.42 21 21 16.52 21 11V5L12 1ZM12 19C8.13 19 5 15.87 5 12V6.5L12 3.1L19 6.5V12C19 15.87 15.87 19 12 19ZM12 7C11.45 7 11 7.45 11 8V12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12V8C13 7.45 12.55 7 12 7Z" fill="currentColor"/>
              </svg>
              <div className="flex flex-col justify-center">
                <p className="font-medium text-[13px]">User Safety</p>
                <p className="text-(--text-muted) text-[12px]">On All Orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {forYou.length > 0 && 
        <ul className="flex flex-col gap-3 w-full px-2 py-2">
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
                <div key={`product-${product.id + ramdomKey(10000000000000)}`} className="flex flex-col items-start gap-1">
                  {/* Mostra os clicks para teste: <span className="text-sm text-gray-500">Clicks: {clicks}</span> */}

                  {/* Componente Product */}
                  <Product
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    width="min-w-xs max-w-xs"
                    query=""
                    photo={product.photo || ""}
                    role="user"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </ul>
      }
      {userRecommendations && userRecommendations?.recommendations?.length > 0 && (
        <div className="px-10 w-full mt-10">
          <motion.h2
            className="text-xl font-bold mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Recomendações
          </motion.h2>

          <div className="flex gap-4 overflow-x-auto">
            {userRecommendations?.recommendations.map((rec) => (
              <div
                key={`product-${rec.productId}`}
                className="flex flex-col items-start gap-1"
              >
                {/* Exemplo: mostrar usersInCommon */}
                <span className="text-sm text-gray-500">
                  {rec.usersInCommon} usuários em comum
                </span>

                <Product
                  id={rec.productId}
                  name={rec.productName}
                  price={rec.productPrice}
                  width="min-w-xs max-w-xs"
                  query=""
                  photo=""
                  role="user"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Subcategorias */}
        <AnimatePresence>
          {subCategories.map(subCategory => (
            <SubCategory
              key={`sub-${subCategory.id + ramdomKey(10000000000000)}`} // ✅ Prefixo evita conflito de keys
              id={subCategory.id}
              name={subCategory.name}
              slug={subCategory.slug}
              role="user"
            />
          ))}
        </AnimatePresence>
      {/* Sentinela Infinite Scroll */}
      {hasMore && (
        <div
          ref={ref}
          className="py-4 mb-125 text-center text-sm text-gray-400"
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