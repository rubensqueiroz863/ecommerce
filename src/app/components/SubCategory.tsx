"use client";

import { useEffect, useState } from "react";
import { SubCategoryProps } from "../types/subCategory";
import { ProductProps } from "../types/product";
import Product from "./Product";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SubCategory({ name, slug }: SubCategoryProps) {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/subcategoria/${slug}`
        );

        const data: ProductProps[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // 🔹 Enquanto carrega
  if (loading) {
    return (
       <div 
        className="px-10 w-full mt-10">
        <h2 
          className="text-xl font-bold mb-4"
        >
          {name || "Categoria"}
        </h2>

        <div className="flex gap-4 overflow-x-auto">
            <div className={`flex flex-col mb-4 bg-(--bg-card) rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden`}>
              
              <div className="flex items-center justify-center bg-white p-4">
                <Image
                  src={"https://i.postimg.cc/7hhdqMRy/ima2311ges.png"}
                  width={800}
                  height={800}
                  alt="Product photo"
                  className="h-56 w-auto object-contain"
                />
              </div>
        
              <div className="flex flex-col gap-1 p-4">
                <p className="text-(--text-main) font-medium line-clamp-2">
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

  // 🔹 Se não tem produtos, não renderiza nada
  if (products.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="px-10 w-full mt-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 
        className="text-xl font-bold mb-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {name}
      </motion.h2>

      <div className="flex gap-4 overflow-x-auto">
        {products.map(product => (
          <Product
            width="min-w-xs max-w-xs"
            key={product.id}
            query=""
            id={product.id}
            name={product.name}
            price={product.price}
            photo={product.photo}
          />
        ))}
      </div>
    </motion.div>
  );
}
