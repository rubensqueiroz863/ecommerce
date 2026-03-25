"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import Footer from "@/app/components/Footer";
import { ProductClientProps, ProductProps } from "@/app/types/product";
import { formatUSD } from "@/lib/formatUSD";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProductAdminClient({ id }: Readonly<ProductClientProps>) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [originalProduct, setOriginalProduct] = useState<ProductProps | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const menu = useAdminMenu();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUSD(e.target.value);
    setPrice(formatted);
  };

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}products/${id}`);
        const data: ProductProps = await res.json();

        setPrice(formatUSD(data.price.toString()));
        setProduct(data);
        setOriginalProduct(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar o produto.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCancel = () => {
    if (!originalProduct) return;
    setProduct(originalProduct);
    setPrice(formatUSD(originalProduct.price.toString()));
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!product) return;

    const form = e.currentTarget;
    const nameInput = form.nome.value;
    const priceInput = Number(price.replaceAll(/\D/g, "")) / 100;

    setEditLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput, price: priceInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Erro ao salvar.");
        return;
      }

      setSuccessMessage("Success!");
      setProduct({ ...product, name: nameInput, price: priceInput });
      setOriginalProduct({ ...product, name: nameInput, price: priceInput });
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar.");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main)">
        <div className="max-w-6xl mx-auto px-4 mt-10 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="w-full h-80 bg-(--bg-soft) rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-(--bg-soft) rounded" />
              <div className="h-4 w-full bg-(--bg-soft) rounded" />
              <div className="h-4 w-5/6 bg-(--bg-soft) rounded" />
              <div className="h-10 w-32 bg-(--bg-soft) rounded mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-main) relative">
      <AnimatePresence>
        {successMessage && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 bg-(--success) text-(--text-light) px-5 py-3 rounded shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-(--bg-card) p-8 rounded-2xl shadow-sm" onSubmit={handleEdit}>
          
          {/* Image */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full h-96 bg-(--bg-soft) rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={product?.photo || "https://i.postimg.cc/pXsJJ92z/526867-200.png"}
                alt={product?.name}
                className="max-h-full object-contain"
              />
            </div>
            <p className="text-sm text-(--text-muted)">Image Preview</p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-(--text-main)">Edit Product</h2>

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-(--text-secondary)">Name</label>
              <input
                type="text"
                name="nome"
                value={product?.name || ""}
                onChange={(e) =>
                  setProduct(prev => prev ? { ...prev, name: e.target.value } : prev)
                }
                className="bg-(--bg-soft) text-(--text-main) border border-(--soft-border) rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-(--text-secondary)">Price</label>
              <input
                name="price"
                type="text"
                value={price}
                onChange={handleChange}
                placeholder="$0.00"
                className="bg-(--bg-soft) text-(--text-main) border border-(--soft-border) rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={editLoading}
                className="bg-(--primary-color) cs text-(--text-light) px-6 py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="border cs border-(--hover-border) text-(--text-main) px-6 py-2 rounded-md hover:bg-(--bg-soft) transition"
              >
                Cancel
              </button>
            </div>
            {error && <p className="text-(--error) mt-2">{error}</p>}
          </div>
        </form>
      </div>
      <AnimatePresence>
        {menu.isOpen && <AdminMenuDrawer />}
      </AnimatePresence>
      <div className="w-full h-px bg-(--soft-border) mt-30 md:mt-35" />
      <Footer />
    </div>
  );
}