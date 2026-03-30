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
  const [changedRoles, setChangedRoles] = useState<Record<string, UserProps["role"]>>({});
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPage = localStorage.getItem("usersRolesAdminPage");
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

    const userId = "832b6d0d-0812-4682-8308-c7d655071595"; // ideal: vir do auth

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join", userId);
    });

    socket.on("order:update", (data) => {
      console.log("Event Received:", data);

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

  // Fetch users com paginação
  useEffect(() => {
    localStorage.setItem("usersRolesAdminPage", page.toString()); // salva a página

    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}users?page=${page}&size=12`
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

  const handleRoleChange = (userId: string, role: UserProps["role"]) => {
    setChangedRoles(prev => ({ ...prev, [userId]: role }));
  };

  const handleSaveRoles = async () => {
    try {
      setSaving(true);
      const updates = Object.entries(changedRoles);

      await Promise.all(
        updates.map(([userId, role]) => {
          const user = users.find(u => u.id === userId);
          if (!user) return;

          const dto = {
            id: user.id,
            email: user.email,
            password: null,
            role,
            name: user.name
          };

          return fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
          });
        })
      );

      setUsers(prev =>
        prev.map(user =>
          changedRoles[user.id] ? { ...user, role: changedRoles[user.id] } : user
        )
      );

      setChangedRoles({});
      alert("Roles updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating roles.");
    } finally {
      setSaving(false);
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
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Loading Users...</p>
      </div>
    );
  }

  const admins = users.filter(user => user.role === "ROLE_ADMIN");
  const normalUsers = users.filter(user => user.role === "ROLE_USER");

  const renderRows = (list: UserProps[]) =>
    list.map(user => (
      <tr
        key={user.id}
        className={`border-t border-[var(--soft-border)] cursor-pointer transition-all duration-200 hover:bg-[var(--bg-soft)] ${
          changedRoles[user.id] ? "opacity-70 bg-[var(--bg-soft)]" : ""
        }`}
        onClick={() => router.push(`/admin/users/${user.id}`)}
      >
        <td className="p-3 text-[var(--text-muted)]">{user.id}</td>
        <td className="p-3 font-medium text-[var(--text-main)]">{user.name}</td>
        <td className="p-3 text-[var(--text-secondary)]">{user.email}</td>
        <td className="p-3">
          <select
            onClick={e => e.stopPropagation()}
            value={changedRoles[user.id] ?? user.role}
            onChange={e => handleRoleChange(user.id, e.target.value as UserProps["role"])}
            className={`bg-[var(--bg-soft)] text-[var(--text-main)] border border-[var(--soft-border)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] cursor-pointer ${
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
    <div className="min-h-screen bg-[var(--bg-main)] px-6 flex flex-col max-w-6xl pb-4 mx-auto">
      <h2 className="text-xl font-semibold mt-4 text-[var(--text-dark)]">Admins</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-[700px] w-full bg-[var(--bg-card)] rounded-t-xl border border-[var(--soft-border)]">
          <thead className="bg-[var(--bg-secondary)] sticky top-0">
            <tr>
              <th className="text-left p-3 text-[var(--text-secondary)]">ID</th>
              <th className="text-left p-3 text-[var(--text-secondary)]">Name</th>
              <th className="text-left p-3 text-[var(--text-secondary)]">Email</th>
              <th className="text-left p-3 text-[var(--text-secondary)]">Role</th>
            </tr>
          </thead>
          <tbody>{renderRows(admins)}</tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mt-4 text-[var(--text-dark)]">Users</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-[700px] w-full bg-[var(--bg-card)] rounded-t-xl border border-[var(--soft-border)]">
          <thead className="bg-[var(--bg-secondary)] sticky top-0">
            <tr>
              <th className="text-left p-3 text-[var(--text-secondary)]">ID</th>
              <th className="text-left p-3 text-[var(--text-secondary)]">Name</th>
              <th className="text-left p-3 text-[var(--text-secondary)]">Email</th>
              <th className="text-left p-3 text-[var(--text-secondary)]">Role</th>
            </tr>
          </thead>
          <tbody>{renderRows(normalUsers)}</tbody>
        </table>
      </div>

      <PaginationControls handleNextPage={handleNextPage} handlePrevPage={handlePrevPage} page={page} hasMore={hasMore} />
      
      {Object.keys(changedRoles).length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSaveRoles}
            disabled={saving}
            className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      <AnimatePresence>
        {menu.isOpen && <AdminMenuDrawer />}
      </AnimatePresence>
    </div>
  );
}