"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import { formatUSD } from "@/lib/formatUSD";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function RegisterProductsAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
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

  const handleApiError = (data: any) => {
    setFieldErrors({});

    switch (data.code) {
      case "INVALID_PRODUCT_NAME":
        setFieldErrors({ nome: data.message });
        break;
      case "INVALID_PRODUCT_PRICE":
        setFieldErrors({ price: data.message });
        break;

      case "SUB_CATEGORY_NOT_FOUND":
        setFieldErrors({ subcategory: data.message });
        break;
      default:
        setError(data.message || "Server error.");
    }
  };

  const handleProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const form = e.currentTarget;
    const nameInput = form.nome.value;
    const priceInput = Number(price.replaceAll(/\D/g, "")) / 100;
    const photoInput = form.photo.value;
    const subCategoryInput = form.subcategory.value;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}products`, {
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

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        handleApiError(data);
        return;
      }

      form.reset();
      setPrice("");
      setSuccessMessage("Success in registering product!");
    } catch (err) {
      console.error(err);
      setError("Error in registering product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-[var(--bg-main)]">
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 bg-[var(--success)] text-[var(--text-light)] px-5 py-3 rounded shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-[var(--bg-card)] w-full max-w-md rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center">
          Register Product
        </h1>
        <form onSubmit={handleProduct} className="flex flex-col gap-4 text-[var(--text-secondary)]">
          <div className="flex flex-col gap-1">
            <label className="text-sm">Product Name</label>
            <input
              name="nome"
              type="text"
              required
              className="bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
            {fieldErrors.nome && <p className="text-[var(--error)] text-sm">{fieldErrors.nome}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Price</label>
            <input
              name="price"
              type="text"
              value={price}
              required
              onChange={handleChange}
              placeholder="$0.00"
              className="bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] rounded-md px-3 py-2"
            />
            {fieldErrors.price && <p className="text-[var(--error)] text-sm">{fieldErrors.price}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Image URL</label>
            <input
              name="photo"
              type="text"
              required
              className="bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
            {fieldErrors.photo && <p className="text-[var(--error)] text-sm">{fieldErrors.photo}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Category</label>
            <select
              name="subcategory"
              className="bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] cursor-pointer rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              <option value="7ee3e263-9a56-4f99-9145-c274f31ddbc9">Audio & Headphones</option>
              <option value="8aa906d4-1a42-4860-8464-85ff9f2317d5">Tablets</option>
              <option value="d5c0f357-a781-4481-8628-895778f8682c">Laptops</option>
              <option value="f385ddd2-0430-4a89-af5b-737ade53aeed">Smartphones</option>
              <option value="f9cee331-e930-43d7-9929-bbe668281776">TV & Video</option>
              <option value="fe061032-770c-4180-94bd-4a2b1b1cbb4c">Computer Accessories</option>
            </select>
            {fieldErrors.subcategory && <p className="text-[var(--error)] text-sm">{fieldErrors.subcategory}</p>}
          </div>
          {error && <p className="text-sm text-[var(--error)] text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 cursor-pointer bg-[var(--primary-color)] text-[var(--text-light)] py-2 rounded-md hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register Product"}
          </button>
        </form>
      </div>
      <AnimatePresence>
        {menu.isOpen && <AdminMenuDrawer />}
      </AnimatePresence>
    </div>
  );
}