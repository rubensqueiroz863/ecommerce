"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductProps } from "@/app/types/product";
import Product from "@/app/components/Product";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import { useInView } from "react-intersection-observer";
import { PageResponse } from "@/app/types/pageResponse";
import Footer from "@/app/components/Footer";
import { AnimatePresence } from "framer-motion";
import MenuDrawer from "@/app/components/MenuDrawer";
import CartDrawer from "@/app/components/CartDrawer";
import { SearchProps } from "@/app/types/search";
import { useMenu } from "@/lib/menu";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import SkeletonSubCategory from "@/app/components/SkeletonSubCategory";

// Tipagem das recomendações
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

async function fetchRecommendations(userId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}events/users/${userId}/recommendations`,
      { headers: { Accept: "application/json" } }
    );

    if (!res.ok) throw new Error(`Erro ao buscar produtos: ${res.status}`);

    const data: UserRecommendationGroup = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export default function SearchClient({ query }: SearchProps) {
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<ProductProps[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([]);

  const { ref, inView } = useInView({ threshold: 0, triggerOnce: false });
  const router = useRouter();
  const menu = useMenu();
  const cart = useCart();
  const decodedQuery = decodeURIComponent(query);

  const { user } = useAuth();

  const fetchProducts = useCallback(
    async (pageNum: number = 0) => {
      if (!query) return;

      setLoading(true);
      setSearched(false);

      try {
        const params = new URLSearchParams({
          q: decodedQuery,
          page: pageNum.toString(),
          limit: "12",
          fuzzy: "true",
          min_score: "50",
        });

        // EXEMPLOS DE FILTROS (pode vir de state depois)
        const filters = {
          price_min: 1000,
          price_max: 9000,
          //subcategory: "Smartphones",
          name_contains: decodedQuery
        };

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });

        const sort_by = "price_desc";
        if (sort_by) {
          params.append("sort_by", sort_by);
        }

        const res = await fetch(
          `https://search-api-xamv.onrender.com/search?${params.toString()}`
        );

        if (!res.ok) {
          throw new Error("Erro ao buscar produtos");
        }

        const data: PageResponse<ProductProps> = await res.json();

        if (pageNum === 0) setResults(data.data);
        else setResults((prev) => [...prev, ...data.data]);

        setHasMore(data.hasMore);
        setPage(pageNum + 1);
        setSearched(true);

      } catch (err) {
        console.error("Erro na busca:", err);
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) fetchProducts(page);
  }, [loading, hasMore, fetchProducts, page]);

  useEffect(() => {
    if (!query) {
      router.push("/");
      return;
    }
    fetchProducts(0);
  }, [query, fetchProducts, router]);

  useEffect(() => {
    if (inView) loadMore();
  }, [inView, loadMore]);

  useEffect(() => {
    if (user?.id != null) {
      async function loadRecommendations() {
        const userId = user!.id;
        const data = await fetchRecommendations(userId);
        if (data) setRecommendations(data.recommendations);
      }

      loadRecommendations();
    }
    
  }, [user?.id]);

  function search(q: string) {
    router.push(`/search/${query}`);
  }

  if (!query) return null;

  return (
    <div className="bg-[var(--bg-main)] min-h-screen">
      <NavBar onSearch={search} />
      {searched && (
        <div className="flex flex-col px-4 md:px-8 py-4">
          <p className="text-xl text-[var(--text-dark)] font-semibold">{decodedQuery}</p>
          <p className="text-sm text-[var(--text-secondary)]">{results.length} resultados</p>
        </div>
      )}
      {loading && !searched && (
        <SkeletonSubCategory count={12}/>
      )}
      {!loading && results.length > 0 && (
        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-6 px-4">
          {results.map((product, index) => (
            <div key={product.id} className="relative flex flex-col items-center">
              <Product
                width=""
                query={query}
                id={product.id}
                role="user"
                name={product.name}
                price={product.price}
                photo={product.photo}
              />
            </div>
          ))}
        </ul>
      )}
      {!loading && searched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <img src="/empty-box.svg" alt="No results" className="w-32 mb-4" />
          <p className="text-[var(--text-dark)] font-semibold mb-2">Nenhum produto encontrado</p>
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            Tente outra palavra-chave ou explore nossas categorias
          </p>
          <button
            onClick={() => router.push("/categories")}
            className="px-4 py-2 bg-[var(--primary-color)] rounded-md text-white"
          >
            Ver categorias
          </button>
        </div>
      )}
      {hasMore && (
        <div ref={ref} className="h-12 flex items-center justify-center my-6">
          {loading && <p className="text-sm text-[var(--text-muted)]">Carregando mais produtos...</p>}
        </div>
      )}
      {recommendations.length > 0 && (
        <div className="px-4 my-8">
          <p className="text-lg font-semibold text-[var(--text-dark)] mb-4">Produtos recomendados para você</p>
          <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {recommendations.map((rec) => (
              <Product
                key={rec.productId}
                width=""
                query=""
                id={rec.productId}
                role="user"
                name={rec.productName}
                price={rec.productPrice}
                photo=""
              />
            ))}
          </ul>
        </div>
      )}
      <AnimatePresence>{menu.isOpen && <MenuDrawer />}</AnimatePresence>
      <AnimatePresence>{cart.isOpen && <CartDrawer />}</AnimatePresence>
      <Footer />
    </div>
  );
}