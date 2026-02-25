// hooks/useAuth.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth(redirectPath?: string) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push(`/login?redirect=${redirectPath || "/"}`);
    }
  }, []);
}