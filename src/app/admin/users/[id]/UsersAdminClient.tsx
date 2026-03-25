"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import Footer from "@/app/components/Footer";
import { ProductClientProps } from "@/app/types/product";
import { UserProps } from "@/app/types/user";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function UserAdminClient({ id }: Readonly<ProductClientProps>) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProps | null>(null);
  const [originalUser, setOriginalUser] = useState<UserProps | null>(null);
  const [error, setError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const menu = useAdminMenu();

  let socket: Socket;

  useEffect(() => {
    async function fetchUser() {
      if (!id) return;

      setLoading(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}users/${id}`);
        const data: UserProps = await res.json();
        setUser(data);
        setOriginalUser(data);
      } catch (err) {
        console.error(err);
        setError("Error in fetching user.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_API_URL!);
    const userId = "832b6d0d-0812-4682-8308-c7d655071595";

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join", userId);
    });

    socket.on("order:update", (data) => {
      if (!data) return;

      if (data.type === "USER_UPDATED" && data.user.id === id) {
        setUser(data.user);
        setOriginalUser(data.user);
        setSuccessMessage("User updated in real time!");
      }

      if (data.type === "USER_DELETED" && data.userId === id) {
        setUser(null);
        setError("This user has been deleted!");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}users/${id}`, {
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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Error in patching user.");
        return;
      }

      setSuccessMessage("Success in patching user!");
      setOriginalUser(user);
    } catch (err) {
      console.error(err);
      setError("Error in saving data.");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <p className="text-[var(--error)]">User not found or deleted.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] relative">
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
      <div className="max-w-xl mx-auto px-4 py-16">
        <form
          onSubmit={handleEdit}
          className="bg-[var(--bg-card)] p-8 rounded-2xl shadow-sm flex flex-col gap-6 border border-[var(--soft-border)]"
        >
          <h2 className="text-2xl font-semibold text-[var(--text-main)]">
            Edit User
          </h2>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-secondary)]">Name</label>
            <input
              type="text"
              value={user?.name || ""}
              onChange={(e) =>
                setUser((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
              className="bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-secondary)]">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              onChange={(e) =>
                setUser((prev) =>
                  prev ? { ...prev, email: e.target.value } : prev
                )
              }
              className="bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--text-secondary)]">Role</label>
            <select
              value={user?.role || "ROLE_USER"}
              onChange={(e) =>
                setUser((prev) =>
                  prev
                    ? {
                        ...prev,
                        role: e.target.value as "ROLE_USER" | "ROLE_ADMIN",
                      }
                    : prev
                )
              }
              className="bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] cursor-pointer"
            >
              <option value="ROLE_USER">User</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={editLoading}
              className="bg-[var(--primary-color)] text-black px-6 py-2 rounded-md hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="border border-[var(--hover-border)] text-[var(--text-main)] px-6 py-2 rounded-md hover:bg-[var(--bg-soft)] transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-[var(--error)]">{error}</p>}
        </form>
      </div>
      <AnimatePresence>
        {menu.isOpen && <AdminMenuDrawer />}
      </AnimatePresence>
      <Footer />
    </div>
  );
}