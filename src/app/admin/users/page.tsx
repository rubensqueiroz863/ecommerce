"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import { useAdminMenu } from "@/lib/menu";
import { UserProps } from "@/app/types/user";
import { io } from "socket.io-client";
import PaginationControls from "@/app/components/PaginationControls";

interface PageResponse<T> {
  data: T[];
  hasMore: boolean;
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPage = localStorage.getItem("usersAdminPage");
      return savedPage ? parseInt(savedPage, 10) : 0;
    }
    return 0;
  });
  const [hasMore, setHasMore] = useState(false);

  const router = useRouter();
  const menu = useAdminMenu();

  // WebSocket updates
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_API_URL);

    const userId = "832b6d0d-0812-4682-8308-c7d655071595";

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join", userId);
    });

    socket.on("order:update", (data) => {
      if (data.type === "USER_CREATED") {
        setUsers((prev) => {
          const exists = prev.some(u => u.id === data.user.id);
          if (exists) return prev;
          return [data.user, ...prev];
        });
      }

      if (data.type === "USER_UPDATED") {
        setUsers((prev) =>
          prev.map((u) => (u.id === data.user.id ? data.user : u))
        );
      }

      if (data.type === "USER_DELETED") {
        setUsers((prev) => prev.filter((u) => u.id !== data.userId));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch users with pagination
  useEffect(() => {
    localStorage.setItem("usersAdminPage", page.toString());

    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}users?page=${page}&size=10`
        );
        const data: PageResponse<UserProps> = await res.json();
        setUsers(data.data);
        setHasMore(data.hasMore);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [page]);

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

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (hasMore) setPage(page + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <p className="text-[var(--text-muted)]">Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="min-h-screen bg-[var(--bg-main)] w-full p-10 flex flex-col items-center">
        <div className="w-full max-w-6xl overflow-x-auto rounded-t-xl">
          <table className="min-w-[700px] w-full bg-[var(--bg-card)] shadow-md border border-[var(--soft-border)]">
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
              {users?.map(user => (
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
        </div>
        {/* Pagination controls */}
        <PaginationControls handleNextPage={handleNextPage} handlePrevPage={handlePrevPage} page={page} hasMore={hasMore} />
        <AnimatePresence>
          {menu.isOpen && <AdminMenuDrawer />}
        </AnimatePresence>
      </div>
    </div>
  );
}