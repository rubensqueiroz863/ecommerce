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

export default function SearchClient({ query }: SearchProps) {
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
  const menu = useMenu();
  const cart = useCart();

  useEffect(() => {
    async function findProducts() {
      if (!query) router.push("/");

      setLoading(true);
      setSearched(false);

      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/buscar?name=${query}&page=0&size=4`
      );

      const data: PageResponse<ProductProps> = await res.json();

      setResults(data.data);
      setHasMore(data.hasMore);
      setPage(1);
      setSearched(true);
      setLoading(false);
    }

    findProducts();
  }, [query]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/buscar?name=${query}&page=${page}&size=4`
      );
      const data: PageResponse<ProductProps> = await res.json();
      
      setResults(prev => [...prev, ...data.data]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [query, page, hasMore, loading]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  function search(query: string) {
    router.push(`/search/${query}`);
  }

  if (!query) router.push("/");

  return (
    <div>
      <NavBar onSearch={search} />
      <div className="w-full h-px bg-(--hover-border)" />
      {loading && !searched ? (
        <p className="px-4 my-4 mb-[400px] text-(--text-main) font-bold">
          Searching...
        </p>
      ) : searched ? (
        <div className="flex my-4 px-4 flex-col">
          <p className="text-xl text-(--text-main) font-bold">
            {query}
          </p>
          <p className="text-sm text-(--text-secondary)">
            {results.length} results.
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
        {results.map(product => (
          <Product
            key={product.id}
            width=""
            query={query}
            id={product.id}
            role="user"
            name={product.name}
            price={product.price}
            photo={product.photo}
          />
        ))}
      </ul>
      {hasMore && (
        <div
          ref={ref}
          className="h-10 flex items-center justify-center my-6"
        >
          {loading && (
            <p className="text-sm text-gray-400">
              Loading more products...
            </p>
          )}
        </div>
      )}
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