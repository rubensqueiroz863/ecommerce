"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import TableSkeleton from "@/app/components/TableSkeleton";
import { ProductLog } from "@/app/types/product";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PageResponse<T> {
  content: T[];
  first: boolean;
  last: boolean;
  number: number; // página atual (zero-based)
  totalPages: number;
  size: number;
  totalElements: number;
}

export default function ProductActivityLogs() {
  const [logs, setLogs] = useState<ProductLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPage = localStorage.getItem("productsLogsAdminPage");
      return savedPage ? parseInt(savedPage, 10) : 0;
    }
    return 0;
  });
  const [totalPages, setTotalPages] = useState(0);
  const menu = useAdminMenu();

  const fetchLogs = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}logs/products?page=${pageNumber}&size=6`
      );
      const data: PageResponse<ProductLog> = await res.json();

      setLogs(data.content);
      setPage(data.number);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Erro ao buscar logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const handlePrev = () => {
    if (page > 0) {
      const newPage = page - 1;
      setPage(newPage);
      localStorage.setItem("productsLogsAdminPage", newPage.toString());
    }
  };

  const handleNext = () => {
    if (page + 1 < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      localStorage.setItem("productsLogsAdminPage", newPage.toString());
    }
  };

  if (loading) {
    return (
      <TableSkeleton />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[var(--text-dark)]">
          Logs of Products Activities
        </h2>

        <div className="overflow-x-auto border border-[var(--soft-border)] rounded-xl">
          <table className="min-w-full bg-[var(--bg-card)] rounded-xl overflow-hidden">
            <thead className="bg-[var(--bg-soft)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                  By
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--soft-border)]">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-[var(--bg-soft)] transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-main)] font-medium">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                    {log.productId}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                    {log.performedBy}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className="px-4 py-2 cs bg-[var(--bg-secondary)] rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-[var(--text-secondary)]">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page + 1 >= totalPages}
            className="px-4 py-2 cs bg-[var(--bg-secondary)] rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu.isOpen && <AdminMenuDrawer />}
      </AnimatePresence>
    </div>
  );
}