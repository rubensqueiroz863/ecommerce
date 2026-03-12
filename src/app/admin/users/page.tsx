"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import { useAdminMenu } from "@/lib/menu";

type UserProps = {
  id: string;
  name: string;
  email: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
};

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const menu = useAdminMenu();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("https://sticky-charil-react-blog-3b39d9e9.koyeb.app/user/all");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm("Deseja deletar este usuário?")) return;

    try {
      await fetch(`https://sticky-charil-react-blog-3b39d9e9.koyeb.app/user/delete/${userId}`, {
        method: "DELETE",
      });

      // remove da lista em tempo real
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p className="p-4">Carregando usuários...</p>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto overflow-x-auto p-16">
      <table className="w-full bg-(--bg-card) rounded-xl shadow-md overflow-hidden">
        <thead className="bg-(--bg-secondary)">
          <tr>
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Nome</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr
              key={user.id}
              className="border-t cursor-pointer hover:bg-(--bg-main) transition-all duration-200"
              onClick={() => router.push(`/admin/users/${user.id}`)}
            >
              <td className="p-3">{user.id}</td>
              <td className="p-3 font-medium">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3 text-(--error) font-semibold">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // impede o click de chegar no <tr>
                    handleDelete(user.id);
                  }}
                  className="hover:text-red-600 rounded-full cursor-pointer hover:bg-[--text-muted] p-1 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AnimatePresence>{menu.isOpen && <AdminMenuDrawer />}</AnimatePresence>

    </div>
  );
}