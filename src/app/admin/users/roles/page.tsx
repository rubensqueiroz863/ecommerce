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
  const [changedRoles, setChangedRoles] = useState<Record<string, UserProps["role"]>>({});
  const [saving, setSaving] = useState(false);

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

  const handleRoleChange = (userId: string, role: UserProps["role"]) => {
    setChangedRoles(prev => ({ ...prev, [userId]: role }));
  };

  const handleSaveRoles = async () => {
    try {
      setSaving(true);
      const updates = Object.entries(changedRoles);

      await Promise.all(
        updates.map(([userId, role]) =>
          fetch(`https://sticky-charil-react-blog-3b39d9e9.koyeb.app/user/edit/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
          })
        )
      );

      // depois que salva, atualiza o state users
      setUsers(prev =>
        prev.map(user =>
          changedRoles[user.id] ? { ...user, role: changedRoles[user.id] } : user
        )
      );

      setChangedRoles({});
      alert("Roles atualizadas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar roles");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Deseja deletar este usuário?")) return;

    try {
      await fetch(`https://sticky-charil-react-blog-3b39d9e9.koyeb.app/user/delete/${userId}`, { method: "DELETE" });
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-4">Carregando usuários...</p>;

  const admins = users.filter(user => user.role === "ROLE_ADMIN");
  const normalUsers = users.filter(user => user.role === "ROLE_USER");

  const renderRows = (list: UserProps[]) =>
    list.map(user => (
      <tr
        key={user.id}
        className={`border-t cursor-pointer hover:bg-(--bg-main) transition-all duration-200 ${
          changedRoles[user.id] ? "bg-(--bg-card) opacity-70" : ""
        }`}
        onClick={() => router.push(`/admin/users/${user.id}`)}
      >
        <td className="p-3">{user.id}</td>
        <td className="p-3 font-medium">{user.name}</td>
        <td className="p-3">{user.email}</td>

        <td className="p-3">
          <select
            onClick={e => e.stopPropagation()}
            value={changedRoles[user.id] ?? user.role} // mostra alteração se houver
            onChange={e => handleRoleChange(user.id, e.target.value as UserProps["role"])}
            className={`border cursor-pointer rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800 ${
              changedRoles[user.id] ? "opacity-70" : ""
            }`}
          >
            <option value="ROLE_USER">User</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </td>
      </tr>
    ));

  return (
    <div className="w-full max-w-5xl mx-auto overflow-x-auto p-16 flex flex-col gap-10">
      {/* ADMINS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Admins</h2>
        <table className="w-full bg-(--bg-card) rounded-xl shadow-md overflow-hidden">
          <thead className="bg-(--bg-secondary)">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{renderRows(admins)}</tbody>
        </table>
      </div>

      {/* USERS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Usuários</h2>
        <table className="w-full bg-(--bg-card) rounded-xl shadow-md overflow-hidden">
          <thead className="bg-(--bg-secondary)">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{renderRows(normalUsers)}</tbody>
        </table>
      </div>

      {/* botão de salvar alterações */}
      {Object.keys(changedRoles).length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSaveRoles}
            disabled={saving}
            className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      )}

      <AnimatePresence>{menu.isOpen && <AdminMenuDrawer />}</AnimatePresence>
    </div>
  );
}