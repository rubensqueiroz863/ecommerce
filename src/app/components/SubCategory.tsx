"use client";

import { useEffect, useState } from "react";
import { SubCategoryProps } from "../types/subCategory";
import { ProductProps } from "../types/product";
import Product from "./Product";
import { motion } from "framer-motion";
import Image from "next/image";
import { PageResponse } from "../types/pageResponse";

export default function SubCategory({ name, slug }: Readonly<SubCategoryProps>) {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/subcategoria/${slug}?page=0&size=12`
        );

        const data: PageResponse<ProductProps> = await res.json();

        setProducts(data.data);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // 🔹 Loading
  if (loading) {
    return (
      <div className="px-10 w-full mt-10">
        <h2 className="text-xl font-bold mb-4">
          Categoria
        </h2>

        <div className="flex gap-4 overflow-x-auto">
          <div className="flex flex-col mb-4 bg-(--bg-card) rounded-2xl shadow-md overflow-hidden">
            <div className="flex items-center justify-center bg-white p-4">
              <Image
                src="https://i.postimg.cc/7hhdqMRy/ima2311ges.png"
                width={800}
                height={800}
                alt="Product photo"
                className="h-56 w-auto object-contain"
              />
            </div>

            <div className="flex flex-col gap-1 p-4">
              <p className="text-(--text-main) font-medium">
                Carregando...
              </p>
              <p className="text-(--success) font-semibold text-lg">
                R$ 00.00
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Sem produtos
  if (products.length === 0) {
    return null;
  }

  return (
    // Card das subcategorias
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
        {name}
      </motion.h2>
      { /* Cards dos produtos */}
      <div className="flex gap-4 overflow-x-auto">
        {products.map(product => (
          <Product
            key={product.id}
            width="min-w-xs max-w-xs"
            query=""
            id={product.id}
            name={product.name}
            price={product.price}
            photo={product.photo}
          />
        ))}
      </div>

      {/* futuro infinite scroll */}
      {hasMore && (
        <p className="text-sm text-gray-400 mt-2">
          Mais produtos disponíveis…
        </p>
      )}
    </motion.div>
  );
}
