"use client";

import AdminMenuDrawer from "@/app/components/AdminMenuDrawer";
import { useAdminMenu } from "@/lib/menu";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Log = {
  id: string;
  userId: string;
  performedBy: string;
  action: string;
  details: string;
  timestamp: string;
};

export default function UserActivityLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const menu = useAdminMenu();

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("https://sticky-charil-react-blog-3b39d9e9.koyeb.app/user/activity");
        const data = await res.json();
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
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-6">Logs de Atividades de Usuários</h2>
        <p className="text-gray-500">Carregando logs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-6">Logs de Atividades de Usuários</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Timestamp</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ação</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Usuário afetado</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Realizado por</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Detalhes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 text-sm text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-gray-600 font-medium">{log.action}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{log.userId}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{log.performedBy}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>{menu.isOpen && <AdminMenuDrawer />}</AnimatePresence>
    </div>
  );
}