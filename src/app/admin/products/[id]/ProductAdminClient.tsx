"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import Footer from "@/app/components/Footer";
import { ProductProps } from "@/app/types/product";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  id: string;
};

export default function ProductAdminClient({ id }: Readonly<Props>) {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [originalProduct, setOriginalProduct] = useState<ProductProps | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const menu = useAdminMenu();

  // 🔹 Função para formatar BRL
  const formatBRL = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const number = Number(numbers) / 100;
    return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBRL(e.target.value);
    setPrice(formatted);
  };

  // Fetch do produto
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);

      try {
        const res = await fetch(`https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/${id}`);
        const data: ProductProps = await res.json();

        setPrice(
          data.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        );
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

  // Remove toast após 3s
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCancel = () => {
    if (!originalProduct) return;
    setProduct(originalProduct);
    setPrice(originalProduct.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
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
      const res = await fetch(`https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput, price: priceInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Erro ao salvar.");
        return;
      }

      setSuccessMessage("Produto atualizado com sucesso!");
      setProduct({ ...product, name: nameInput, price: priceInput });
      setOriginalProduct({ ...product, name: nameInput, price: priceInput });
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar.");
    } finally {
      setEditLoading(false);
    }
  };

  // 🔹 Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main)">
        <div className="max-w-6xl mx-auto px-4 mt-10 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="w-full h-80 bg-gray-300 rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-300 rounded" />
              <div className="h-4 w-full bg-gray-300 rounded" />
              <div className="h-4 w-5/6 bg-gray-300 rounded" />
              <div className="h-10 w-32 bg-gray-300 rounded mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-main) relative">
      {/* Notificação de sucesso */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 bg-green-500 text-white px-5 py-3 rounded shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <form onSubmit={handleEdit} className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-(--bg-card) p-8 rounded-2xl shadow-sm">
          {/* Imagem */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-full h-96 bg-(--bg-main) rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={product?.photo || "https://i.postimg.cc/pXsJJ92z/526867-200.png"}
                alt={product?.name}
                className="max-h-full object-contain"
              />
            </div>
            <p className="text-sm text-neutral-500">Preview da imagem do produto</p>
          </div>

          {/* Informações */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-(--text-main)">Editar Produto</h2>

            {/* Nome */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-500">Nome do produto</label>
              <input
                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-neutral-800"
                type="text"
                name="nome"
                value={product?.name || ""}
                onChange={(e) =>
                  setProduct(prev => prev ? { ...prev, name: e.target.value } : prev)
                }
              />
            </div>

            {/* Preço */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-500">Preço</label>
              <input
                name="price"
                type="text"
                value={price}
                onChange={handleChange}
                placeholder="R$ 0,00"
                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-neutral-800"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={editLoading}
                className="bg-neutral-900 cursor-pointer text-white px-6 py-2 rounded-md hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {editLoading ? "Salvando..." : "Salvar alterações"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border px-6 py-2 rounded-md cursor-pointer hover:bg-neutral-400 transition"
              >
                Cancelar
              </button>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </form>
      </div>

      <AnimatePresence>{menu.isOpen && <AdminMenuDrawer />}</AnimatePresence>

      <div className="w-full h-px bg-(--soft-border) mt-30 md:mt-35" />
      <Footer />
    </div>
  );
}