"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import ClicksChart from "@/app/components/ClicksChart";
import ProductsClicksChart from "@/app/components/ProductsClicksChart";
import RelatedProductsChart from "@/app/components/RelatedProductsChart";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const currentYear = new Date().getFullYear();
  const menu = useAdminMenu();

  return (
    <div>
      <div className="flex flex-col items-start p-12 gap-4">
        <div className="w-full flex flex-col gap-4 font-bold text-(--text-dark) text-xl">
          <h1 className="px-16">Total Clicks of By Months { currentYear }</h1>
          <ClicksChart />
        </div>
        <div className="w-full flex flex-col gap-4 font-bold text-(--text-dark) text-xl">
          <h1 className="px-16">Most Clicked of { currentYear }</h1>
          <ProductsClicksChart />
        </div>
        <div className="w-full flex flex-col gap-4 font-bold text-(--text-dark) text-xl">
          <h1 className="px-16">Related Products</h1>
          <RelatedProductsChart />
        </div>
      </div>
      <AnimatePresence>{menu.isOpen && <AdminMenuDrawer />}</AnimatePresence>
    </div>
  );
}