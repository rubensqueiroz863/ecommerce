"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import Footer from "@/app/components/Footer";
import NavBarAdmin from "@/app/components/NavBarAdmin";
import { ProductProps } from "@/app/types/product";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence } from "framer-motion";
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

  const router = useRouter();

  const formatBRL = (value: string) => {
    const numbers = value.replaceAll(/\D/g, "");

    const number = Number(numbers) / 100;

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBRL(e.target.value);
    setPrice(formatted);
  };

  const menu = useAdminMenu();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      setLoading(true);

      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/${id}`
      )

      const data: ProductProps = await res.json();
      setPrice(
        data.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      );
      setProduct(data);
      setOriginalProduct(data);
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  const handleCancel = () => {
    if (!originalProduct) return;

    setProduct(originalProduct);

    setPrice(
      originalProduct.price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
  };

  const handleEdit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget as HTMLFormElement;
    const nameInput = form.nome.value;
    const priceInput = Number(price.replaceAll(/\D/g, "")) / 100;

    setEditLoading(true);

    try {
      const res = await fetch(
        `https://sticky-charil-react-blog-3b39d9e9.koyeb.app/produtos/edit/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nameInput,
            price: priceInput
          }),
        }
      );

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setError(data.message || "Erro.");
        return;
      }
    } catch (err) {
      console.error(err);
      setError("Erro");
    } finally {
      setEditLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main)">

        <div className="max-w-6xl mx-auto px-4 mt-10 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Imagem */}
            <div className="w-full h-80 bg-gray-300 rounded-xl" />

            {/* Infos */}
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
    <div className="min-h-screen bg-(--bg-main)">
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

            <p className="text-sm text-neutral-500">
              Preview da imagem do produto
            </p>
          </div>

          {/* Informações */}
          <div className="flex flex-col gap-6">

            <h2 className="text-2xl font-semibold text-(--text-main)">
              Editar Produto
            </h2>

            {/* Nome */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-500">
                Nome do produto
              </label>

              <input
                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-neutral-800"
                type="text"
                name="nome"
                value={product?.name || ""}
                onChange={(e) =>
                  setProduct(prev =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
              />
            </div>

            {/* Preço */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-500">
                Preço
              </label>

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
                className="bg-neutral-900 cursor-pointer text-white px-6 py-2 rounded-md hover:bg-neutral-800 transition"
              >
                Salvar alterações
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="border px-6 py-2 rounded-md cursor-pointer hover:bg-neutral-400 transition"
              >
                Cancelar
              </button>
            </div>

          </div>
        </form>
      </div>

      <AnimatePresence>{menu.isOpen && <AdminMenuDrawer />}</AnimatePresence>

      <div className="w-full h-px bg-(--soft-border) mt-30 md:mt-35" />
      <Footer />
    </div>
  );

}