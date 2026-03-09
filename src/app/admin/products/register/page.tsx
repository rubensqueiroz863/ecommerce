"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function RegisterProductsAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [price, setPrice] = useState("");

  const menu = useAdminMenu();

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
        setError(data.message || "Dados inválidos.");
        return;
      }

      form.reset();
      setPrice("");
    } catch (err) {
      console.error(err);
      setError("Erro ao registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-neutral-100">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">

        <h1 className="text-2xl font-semibold text-neutral-800 mb-6 text-center">
          Registrar Produto
        </h1>

        <form
          onSubmit={handleProduct}
          className="flex flex-col gap-4 text-neutral-700"
        >

          <div className="flex flex-col gap-1">
            <label className="text-sm">Nome do produto</label>
            <input
              name="nome"
              type="text"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Preço</label>
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
            <label className="text-sm">URL da imagem</label>
            <input
              name="photo"
              type="text"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Categoria</label>
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
            {loading ? "Registrando..." : "Registrar Produto"}
          </button>
        </form>
      </div>
      <AnimatePresence>{menu.isOpen && <AdminMenuDrawer />}</AnimatePresence>
    </div>
  );
}