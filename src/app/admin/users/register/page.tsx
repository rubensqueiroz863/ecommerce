"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function RegisterUsersAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const menu = useAdminMenu();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleApiError = (data: any) => {
    setFieldErrors({});

    switch (data.code) {
      case "EMAIL_ALREADY_EXISTS":
        setFieldErrors({ email: "This email is already in use." });
        break;

      case "INVALID_EMAIL":
        setFieldErrors({ email: data.message });
        break;

      case "WEAK_PASSWORD":
        setFieldErrors({ password: data.message });
        break;

      case "INVALID_NAME":
        setFieldErrors({ nome: data.message });
        break;

      default:
        setError(data.message || "Server error.");
    }
  };

  const handleUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const form = e.currentTarget;

    const nameInput = form.nome.value;
    const emailInput = form.email.value;
    const passwordInput = form.password.value;
    const roleInput = form.userRole.value;

    if (!nameInput || !emailInput || !passwordInput || !roleInput) {
      setError("Fill all data to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}users`, {
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
      setSuccessMessage("Success in registering user!");
    } catch (err) {
      console.error(err);
      setError("Error in registering user.");
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
            className="fixed top-5 right-5 bg-[var(--success)] text-white px-5 py-3 rounded shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-[var(--bg-card)] w-full max-w-md rounded-xl shadow-lg p-8 border border-[var(--soft-border)]">
        <h1 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center">
          Register User
        </h1>
        <form onSubmit={handleUser} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-secondary)]">Name</label>
            <input
              name="nome"
              type="text"
              required
              className="bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
            {fieldErrors.nome && <p className="text-[var(--error)] text-sm">{fieldErrors.nome}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-secondary)]">Email</label>
            <input
              name="email"
              type="email"
              required
              className="bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
            {fieldErrors.email && <p className="text-[var(--error)] text-sm">{fieldErrors.email}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-secondary)]">Password</label>
            <input
              name="password"
              type="password"
              minLength={8}
              maxLength={100}
              required
              className="bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
            {fieldErrors.password && <p className="text-[var(--error)] text-sm">{fieldErrors.password}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-secondary)]">Role</label>
            <select
              name="userRole"
              className="bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] cursor-pointer"
            >
              <option value="ROLE_USER">User</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
          {error && <p className="text-sm text-[var(--error)] text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[var(--primary-color)] text-black py-2 rounded-md hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Registering..." : "Register User"}
          </button>
        </form>
      </div>
      <AnimatePresence>
        {menu.isOpen && <AdminMenuDrawer />}
      </AnimatePresence>
    </div>
  );
}