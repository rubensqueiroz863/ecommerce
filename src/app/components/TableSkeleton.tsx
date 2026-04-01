"use client";

import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence } from "framer-motion";
import AdminMenuDrawer from "./AdminMenuDrawer";

export default function TableSkeleton() {
  const menu = useAdminMenu();

  return (
    <div className="w-full">
      <div className="min-h-screen bg-[var(--bg-main)] w-full p-10 flex flex-col items-center">
        <div className="w-full max-w-6xl overflow-x-auto rounded-t-xl">

          {/* Search skeleton */}
          <div className="mb-4 w-full max-w-md h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--soft-border)] animate-pulse" />

          <table className="min-w-[700px] w-full bg-[var(--bg-card)] shadow-md border border-[var(--soft-border)]">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="text-left p-3 text-[var(--text-secondary)]">ID</th>
                <th className="text-left p-3 text-[var(--text-secondary)]">Name</th>
                <th className="text-left p-3 text-[var(--text-secondary)]">Email</th>
                <th className="text-left p-3 text-[var(--text-secondary)]">Role</th>
                <th className="p-3"></th>
              </tr>
            </thead>

            <tbody>
              {[...Array(10)].map((_, index) => (
                <tr key={index} className="border-t border-[var(--soft-border)]">
                  
                  <td className="p-3">
                    <div className="h-4 w-32 bg-[var(--bg-soft)] rounded animate-pulse" />
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-24 bg-[var(--bg-soft)] rounded animate-pulse" />
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-40 bg-[var(--bg-soft)] rounded animate-pulse" />
                  </td>

                  <td className="p-3">
                    <div className="h-4 w-20 bg-[var(--bg-soft)] rounded animate-pulse" />
                  </td>

                  <td className="p-3 flex justify-center">
                    <div className="h-6 w-6 rounded-full bg-[var(--bg-soft)] animate-pulse" />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination skeleton */}
        <div className="mt-6 flex gap-4">
          <div className="h-8 w-20 bg-[var(--bg-soft)] rounded animate-pulse" />
          <div className="h-8 w-20 bg-[var(--bg-soft)] rounded animate-pulse" />
        </div>

        <AnimatePresence>
          {menu.isOpen && <AdminMenuDrawer />}
        </AnimatePresence>
      </div>
    </div>
  );
}