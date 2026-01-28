"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductProps } from "@/app/types/product";
import Product from "@/app/components/Product";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import { useInView } from "react-intersection-observer";

type Props = {
  query: string;
};

type PageResponse<T> = {
  data: T[];
  hasMore: boolean;
};

export default function SearchClient({ query }: Props) {
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<ProductProps[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const router = useRouter();

  // 🔹 busca inicial (ou quando query muda)
  useEffect(() => {
    async function findProducts() {
      if (!query) return;

      setLoading(true);
      setSearched(false);

      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/buscar?name=${query}&page=0&size=4`
      );

      const data: PageResponse<ProductProps> = await res.json();

      setResults(data.data);
      setHasMore(data.hasMore);
      setPage(1); // próxima página
      setSearched(true);
      setLoading(false);
    }

    findProducts();
  }, [query]);

  // 🔹 carregar mais
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    // Tenda dar fetch dos produtos
    try {
      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/buscar?name=${query}&page=${page}&size=4`
      );
      // Converte para json
      const data: PageResponse<ProductProps> = await res.json();
      
      // Pega a data com os produtos e se tem mais
      setResults(prev => [...prev, ...data.data]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      // Erro do fetch
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, page, hasMore, loading]);

  // 🔹 quando o sentinela aparece
  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  function search(query: string) {
    router.push(`/search/${query}`);
  }

  return (
    // Pagina dos produtos pesquisados
    <div>
      { /* Navbar */}
      <NavBar onSearch={search} />
      <div className="w-full h-px bg-(--hover-border)" />
      { /* Detecta se está carregando */}
      {loading && !searched ? (
        <p className="px-4 my-4 text-(--text-main) font-bold">
          Buscando...
        </p>
      ) : searched ? (
        <div className="flex my-4 px-4 flex-col">
          <p className="text-xl text-(--text-main) font-bold">
            {query}
          </p>
          <p className="text-sm text-(--text-secondary)">
            {results.length} resultados.
          </p>
        </div>
      ) : null}

      <ul
        className="
          grid
          grid-cols-2
          md:grid-cols-3
          xl:grid-cols-4
          gap-4
          px-4
        "
      >
        { /* Produtos pesquisados */}
        {results.map(product => (
          <Product
            key={product.id}
            width=""
            query={query}
            id={product.id}
            name={product.name}
            price={product.price}
            photo={product.photo}
          />
        ))}
      </ul>

      {/* 🔹 Sentinel */}
      {hasMore && (
        <div
          ref={ref}
          className="h-10 flex items-center justify-center my-6"
        >
          {loading && (
            <p className="text-sm text-gray-400">
              Carregando mais resultados...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
