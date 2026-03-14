"use client";

import { useEffect, useState } from "react";
import { SubCategoryProps } from "../types/subCategory";
import { ProductProps } from "../types/product";
import Product from "./Product";
import { motion } from "framer-motion";
import Image from "next/image";
import { PageResponse } from "../types/pageResponse";
import { useRouter } from "next/navigation";
import { OpenSans } from "@/lib/fonts";

export default function SubCategory({ name, slug, role }: Readonly<SubCategoryProps>) {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();

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

  const handleDelete = async (productId: string) => {
    const confirmed = globalThis.confirm("Deseja realmente deletar este produto?");
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:8080/produtos/delete/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      // Remove do state em tempo real
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar o produto.");
    }
  };

  // 🔹 Loading
  if (loading) {
    return role === "user" ? (
      <div className="px-10 w-full mt-10 flex gap-4 overflow-x-auto">
        <div className="flex flex-col mb-4 bg-[--bg-card] rounded-2xl shadow-md overflow-hidden animate-pulse">
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
            <p className="text-[--text-main] font-medium">Carregando...</p>
            <p className="text-[--success] font-semibold text-lg">R$ 00.00</p>
          </div>
        </div>
      </div>
    ) : (
      <p className="text-[--text-main] font-medium">Carregando...</p>
    );
  }

  if (products.length === 0) return null;

  if (role === "user") {
    return (
      <motion.div
        className="px-10 w-full my-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        { /* Nome */}
        <motion.div
          className={`flex mb-8 items-center justify-between gap-18 ${OpenSans.className} text-(--text-dark)`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="md:text-xl text-lg  font-bold text-(--text-dark)">
            {name}
          </p>

          {/* linha */}
          <span className="hidden md:flex md:flex-1 h-px bg-(--text-secondary) opacity-50"></span>

          <button className="bg-(--primary-color) text-[10px] px-2 text-(--text-light) rounded-full md:px-4 py-1 md:text-xs cursor-pointer">
            View All
          </button>
        </motion.div>
        { /* Cards dos produtos */}
        <div className="flex gap-6 overflow-x-auto overflow-y-hidden">
          {products.map((product, index) => (
            <div key={product.id} className="relative flex items-center">
              <Product
                width="min-w-[200px] max-w-[200px]"
                query=""
                id={product.id}
                name={product.name}
                price={product.price}
                photo={product.photo}
                role={role}
              />

              {/* Barra separadora */}
              {index !== products.length - 1 && (
                <span className="absolute bg-(--text-secondary) -right-3 top-1/2 h-full w-px my-2 -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
        {hasMore && <p className="text-sm text-gray-400 mt-2">Mais produtos disponíveis…</p>}
      </motion.div>
    );
  }

  // 🔹 Admin
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
      <div className="overflow-x-auto">
        <table className="w-full bg-(--bg-card) rounded-xl shadow-md overflow-hidden">
          <thead className="bg-[--bg-secondary]">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Produto</th>
              <th className="text-left p-3">Preço</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr
                key={product.id}
                className="border-t hover:bg-(--bg-main) cursor-pointer transition-all duration-200"
                onClick={() => router.push(`/admin/products/${product.id}`)}
              >
                <td className="p-3">{product.id}</td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3 text-[--success] font-semibold">R$ {product.price}</td>
                <td className="p-3 text-[--error] font-semibold">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="hover:text-red-600 rounded-full cursor-pointer hover:bg-(--text-muted) p-1 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && <p className="text-sm text-gray-400 mt-2">Mais produtos disponíveis…</p>}
    </motion.div>
  );
}