"use client";

import { useAdminMenu } from "@/lib/menu";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MenuItem } from "../types/menu";

export default function AdminMenuDrawer() {
  const menu = useAdminMenu();
  const router = useRouter();

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const menuItems: MenuItem[] = [
    {
      label: "Users",
      submenu: [
        { label: "Manage Users", onClick: () => router.push("/admin/users") },
        { label: "Create User", onClick: () => router.push("/admin/users/register") },
        { label: "Manage Roles", onClick: () => router.push("/admin/users/roles") },
        { label: "Activity Logs", onClick: () => router.push("/admin/users/logs") },
      ],
    },
    {
      label: "Products",
      submenu: [
        { label: "Manage Products", onClick: () => router.push("/admin/products") },
        { label: "Add Product", onClick: () => router.push("/admin/products/register") },
        { label: "Categories" },
        { label: "Inventory" },
      ],
    },
    {
      label: "Orders / Sales",
      submenu: [
        { label: "Order List" },
        { label: "Processing" },
        { label: "Sales Reports" },
      ],
    },
    {
      label: "Settings",
      submenu: [
        { label: "System Settings" },
        { label: "Payment Settings" },
        { label: "Integrations (API, webhook, etc.)" },
      ],
    },
    {
      label: "Reports / Analytics",
      submenu: [
        { label: "Dashboard", onClick: () => router.push("/admin/dashboard") },
        { label: "Performance Reports" },
      ],
    },
  ];

  return (
    <>
      <motion.div
        onClick={menu.closeMenu}
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      <motion.div
        className="fixed overflow-auto pb-10 top-0 left-0 md:w-1/3 w-1/2 h-screen bg-(--bg-card) z-50 shadow-lg"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="flex flex-col bg-(--bg-secondary) text-xl font-bold w-full gap-2 py-3 px-3">
          <p>Admin Menu</p>
        </div>
        <div className="w-full px-2">
          <div className="w-full h-px bg-(--soft-border)" />
        </div>

        <div className="flex flex-col w-full">
          {menuItems.map((item, index) => (
            <div key={item.label}>
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex bg-(--bg-secondary) hover:bg-(--bg-card) cursor-pointer flex-row items-center font-bold justify-between w-full gap-2 py-3 px-3 transition-colors"
              >
                <p>{item.label}</p>
                {item.submenu && (
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ rotate: openIndex === index ? -90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <polyline points="5 9 12 16 19 9" />
                  </motion.svg>
                )}
              </button>

              {item.submenu && (
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col overflow-hidden bg-(--bg-secondary)"
                    >
                      {item.submenu.map((sub) => (
                        <button
                          key={sub.label}
                          onClick={sub.onClick}
                          className="text-left cursor-pointer py-2 px-3 hover:bg-(--bg-card) font-medium transition-colors"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}