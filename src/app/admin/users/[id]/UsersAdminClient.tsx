"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import Footer from "@/app/components/Footer";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserProps = {
  id: string;
  name: string;
  email: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
};

type Props = {
  id: string;
};

export default function UserAdminClient({ id }: Readonly<Props>) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProps | null>(null);
  const [originalUser, setOriginalUser] = useState<UserProps | null>(null);

  const [error, setError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
  const menu = useAdminMenu();

  // 🔹 Buscar usuário
  useEffect(() => {
    async function fetchUser() {
      if (!id) return;

      setLoading(true);

      try {
        const res = await fetch(`https://sticky-charil-react-blog-3b39d9e9.koyeb.app/user/${id}`);
        const data: UserProps = await res.json();

        setUser(data);
        setOriginalUser(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar usuário.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  // 🔹 Toast
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCancel = () => {
    if (!originalUser) return;
    setUser(originalUser);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setEditLoading(true);
    setError("");

    try {
      const res = await fetch(`https://sticky-charil-react-blog-3b39d9e9.koyeb.app/user/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erro ao atualizar usuário.");
        return;
      }

      setSuccessMessage("Usuário atualizado com sucesso!");
      setOriginalUser(user);
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar alterações.");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-main) flex items-center justify-center">
        <p className="text-neutral-500">Carregando usuário...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg(--bg-main) relative">
      {/* Toast */}
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

      <div className="max-w-xl mx-auto px-4 py-16">
        <form
          onSubmit={handleEdit}
          className="bg-(--bg-card) p-8 rounded-2xl shadow-sm flex flex-col gap-6"
        >
          <h2 className="text-2xl font-semibold text-(--text-main)">
            Editar Usuário
          </h2>

          {/* Nome */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-500">Nome</label>
            <input
              type="text"
              value={user?.name || ""}
              onChange={(e) =>
                setUser((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-500">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              onChange={(e) =>
                setUser((prev) =>
                  prev ? { ...prev, email: e.target.value } : prev
                )
              }
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Role</label>
            <select
              name="role"
              value={user?.role || "ROLE_USER"}
              onChange={(e) =>
                setUser((prev) =>
                  prev ? { ...prev, role: e.target.value as "ROLE_USER" | "ROLE_ADMIN" } : prev
                )
              }
              className="border cursor-pointer rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            >
              <option value="ROLE_USER">User</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
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
              className="border px-6 py-2 cursor-pointer rounded-md hover:bg-neutral-200 transition"
            >
              Cancelar
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>

      <AnimatePresence>{menu.isOpen && <AdminMenuDrawer />}</AnimatePresence>

      <div className="w-full h-px bg-[--soft-border] mt-30 md:mt-35" />
      <Footer />
    </div>
  );
}