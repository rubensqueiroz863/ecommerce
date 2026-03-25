"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import { useAdminMenu } from "@/lib/menu";
import { UserProps } from "@/app/types/user";
import { io } from "socket.io-client";

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const menu = useAdminMenu();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_API_URL);

    const userId = "832b6d0d-0812-4682-8308-c7d655071595";

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join", userId);
    });

    socket.on("order:update", (data) => {
      console.log("Event received:", data);

      if (data.type === "USER_CREATED") {
        setUsers((prev) => {
          const exists = prev.some(u => u.id === data.user.id);
          if (exists) return prev;

          return [data.user, ...prev];
        });
      }

      if (data.type === "USER_UPDATED") {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === data.user.id ? data.user : u
          )
        );
      }

      if (data.type === "USER_DELETED") {
        setUsers((prev) =>
          prev.filter((u) => u.id !== data.userId)
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_API_URL + "users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error in fetching users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm("Want to delete user?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}users/${userId}`, {
        method: "DELETE",
      });

      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <p className="text-[var(--text-muted)]">Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] w-full max-w-5xl mx-auto overflow-x-auto p-10">
      <table className="w-full bg-[var(--bg-card)] rounded-xl shadow-md overflow-hidden border border-[var(--soft-border)]">
        <thead className="bg-[var(--bg-secondary)]">
          <tr>
            <th className="text-left p-3 text-[var(--text-secondary)]">ID</th>
            <th className="text-left p-3 text-[var(--text-secondary)]">Name</th>
            <th className="text-left p-3 text-[var(--text-secondary)]">Email</th>
            <th className="text-left p-3 text-[var(--text-secondary)]">Role</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr
              key={user.id}
              className="border-t border-[var(--soft-border)] cursor-pointer transition-all duration-200 hover:bg-[var(--bg-soft)]"
              onClick={() => router.push(`/admin/users/${user.id}`)}
            >
              <td className="p-3 text-[var(--text-muted)]">{user.id}</td>
              <td className="p-3 font-medium text-[var(--text-main)]">{user.name}</td>
              <td className="p-3 text-[var(--text-secondary)]">{user.email}</td>
              <td className="p-3 text-[var(--text-secondary)]">{user.role}</td>
              <td className="p-3 text-[var(--error)] font-semibold">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user.id);
                  }}
                  className="hover:bg-[var(--bg-soft)] p-2 rounded-full transition cursor-pointer"
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
      <AnimatePresence>
        {menu.isOpen && <AdminMenuDrawer />}
      </AnimatePresence>
    </div>
  );
}