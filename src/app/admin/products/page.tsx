"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { io, Socket } from "socket.io-client";

import { useAdminMenu } from "@/lib/menu";
import { PageResponse } from "@/app/types/pageResponse";
import { SubCategoryProps } from "@/app/types/category";
import SubCategory from "@/app/components/SubCategory";
import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";

export default function ProductsAdmin() {
  const [subCategories, setSubCategories] = useState<SubCategoryProps[]>([]);
  const [page, setPage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPage = localStorage.getItem("productsAdminPage");
      return savedPage ? parseInt(savedPage, 10) : 0;
    }
    return 0;
  });
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const menu = useAdminMenu();
  const { ref, inView } = useInView({ threshold: 0 });

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_WEBSOCKET_API_URL || "");

    const userId = "832b6d0d-0812-4682-8308-c7d655071595";
    s.on("connect", () => {
      console.log("Connected WS:", s.id);
      s.emit("join", userId);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const fetchSubCategories = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}subcategories?page=${page}&size=6`
      );
      const data: PageResponse<SubCategoryProps> = await res.json();
      setSubCategories(prev => [...prev, ...data.data]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error(err);
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
      <AnimatePresence>
        {subCategories.map(subCategory => (
          <SubCategory
            key={`sub-${subCategory.id}`}
            id={subCategory.id}
            name={subCategory.name}
            slug={subCategory.slug}
            role="admin"
            socket={socket}
          />
        ))}
      </AnimatePresence>
      <AnimatePresence>{menu.isOpen && <AdminMenuDrawer />}</AnimatePresence>
      {hasMore && (
        <div
          ref={ref}
          className="py-4 mb-125 text-center text-sm text-(--text-dark)"
        >
          {loading ? "Loading..." : "Loading more..."}
        </div>
      )}
      <div className="w-full h-px bg-(--soft-border) mt-30 md:mt-35" />
    </div>
  );
}