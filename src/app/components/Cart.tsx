"use client";

import { useCart } from "@/lib/cart";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Cart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cart = useCart();
  return (
    <button
      onClick={() => cart.toggleCart()}
      className="cursor-pointer"
    >
      {mounted && (
        <Image
          src={theme === "dark" ? "https://i.postimg.cc/VN22vfk0/imag32es-removebg-preview.png" : "https://i.postimg.cc/zfbSJCPG/25619.png"}
          width={128}
          height={128}
          alt="Cart button"
          className="w-6 h-6"
        />
      )}
      
    </button>
  );
}