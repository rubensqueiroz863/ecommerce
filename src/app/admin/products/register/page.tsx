"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import { formatUSD } from "@/lib/formatUSD";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function RegisterProductsAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [price, setPrice] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const menu = useAdminMenu();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUSD(e.target.value);
    setPrice(formatted);
  };

  const handleProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const nameInput = form.nome.value;
    const priceInput = Number(price.replaceAll(/\D/g, "")) / 100;
    const photoInput = form.photo.value;
    const subCategoryInput = form.subcategory.value;

    if (!nameInput || !price || !photoInput || !subCategoryInput) {
      setError("Preencha todos os dados para continuar.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameInput,
          price: priceInput,
          photo: photoInput,
          subCategory: subCategoryInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error in server.");
        return;
      }

      form.reset();
      setSuccessMessage("Success in registering product!");
      setPrice("");
    } catch (err) {
      console.error(err);
      setError("Error in registering product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-neutral-100">
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 bg-green-500 text-white px-5 py-3 rounded shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-6 text-center">
          Register Product
        </h1>
        <form
          onSubmit={handleProduct}
          className="flex flex-col gap-4 text-neutral-700"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm">Product Name</label>
            <input
              name="nome"
              type="text"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Price</label>
            <input
              name="price"
              type="text"
              value={price}
              onChange={handleChange}
              placeholder="R$ 0,00"
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Image URL</label>
            <input
              name="photo"
              type="text"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Category</label>
            <select
              name="subcategory"
              className="border cursor-pointer rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            >
              <option className="cursor-pointer" value="7ee3e263-9a56-4f99-9145-c274f31ddbc9">
                Audio & Headphones
              </option>
              <option className="cursor-pointer" value="8aa906d4-1a42-4860-8464-85ff9f2317d5">
                Tablets
              </option>
              <option className="cursor-pointer" value="d5c0f357-a781-4481-8628-895778f8682c">
                Laptops
              </option>
              <option className="cursor-pointer" value="f385ddd2-0430-4a89-af5b-737ade53aeed">
                Smartphones
              </option>
              <option className="cursor-pointer" value="f9cee331-e930-43d7-9929-bbe668281776">
                TV & Video
              </option>
              <option className="cursor-pointer" value="fe061032-770c-4180-94bd-4a2b1b1cbb4c">
                Computer Accessories
              </option>
            </select>
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 cursor-pointer bg-neutral-900 text-white py-2 rounded-md hover:bg-neutral-800 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register Product"}
          </button>
        </form>
      </div>
      <AnimatePresence>{menu.isOpen && <AdminMenuDrawer />}</AnimatePresence>
    </div>
  );
}