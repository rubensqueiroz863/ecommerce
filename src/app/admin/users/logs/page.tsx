"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import { Log } from "@/app/types/user";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function UserActivityLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const menu = useAdminMenu();

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_API_URL + "logs/users");
        
        let data;
        try {
          data = await res.json();
        } catch {
          data = [];
        }

        setLogs(data);
      } catch (err) {
        console.error("Erro ao buscar logs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Loading logs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[var(--text-dark)]">
          Logs of Users Activities
        </h2>
        <div className="overflow-x-auto border border-[var(--soft-border)] rounded-xl">
          <table className="min-w-full bg-[var(--bg-card)] rounded-xl overflow-hidden">
                        <thead className="bg-[var(--bg-soft)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                  By
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--soft-border)]">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-[var(--bg-soft)] transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-main)] font-medium">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                    {log.userId}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                    {log.performedBy}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {menu.isOpen && <AdminMenuDrawer />}
      </AnimatePresence>
    </div>
  );
}