"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function RegisterUsersAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const menu = useAdminMenu();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;

    const nameInput = form.nome.value;
    const emailInput = form.email.value;
    const passwordInput = form.password.value;
    const roleInput = form.userRole.value;

    if (!nameInput || !emailInput || !passwordInput || !roleInput) {
      setError("Preencha todos os dados para continuar.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://sticky-charil-react-blog-3b39d9e9.koyeb.app/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameInput,
          email: emailInput,
          password: passwordInput,
          role: roleInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Dados inválidos.");
        return;
      }

      form.reset();
      setSuccessMessage("Usuário registrado com sucesso!");
    } catch (err) {
      console.error(err);
      setError("Erro ao registrar usuário");
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
          Registrar Usuário
        </h1>

        <form
          onSubmit={handleUser}
          className="flex flex-col gap-4 text-neutral-700"
        >

          {/* Nome */}
          <div className="flex flex-col gap-1">
            <label className="text-sm">Nome</label>
            <input
              name="nome"
              type="text"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm">Email</label>
            <input
              name="email"
              type="email"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-1">
            <label className="text-sm">Senha</label>
            <input
              name="password"
              type="password"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1">
            <label className="text-sm">Role</label>
            <select
              name="userRole"
              className="border cursor-pointer rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            >
              <option value="ROLE_USER">User</option>
              <option value="ROLE_ADMIN">Admin</option>
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
            {loading ? "Registrando..." : "Registrar Usuário"}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {menu.isOpen && <AdminMenuDrawer />}
      </AnimatePresence>
    </div>
  );
}