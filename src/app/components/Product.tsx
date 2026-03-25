"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductProps } from "../types/product";
import { Inter, OpenSans } from "@/lib/fonts";

async function registerClick(clickEvent: { productId: string; userEmail: string }) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_API_URL + "events/clicks",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clickEvent),
      }
    );

    if (!response.ok) {
      if (response.status === 401) return;
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.log("Erro de rede:", err);
  }
}

export default function Product({
  id,
  name,
  price,
  photo,
  width = "w-full",
  role
}: Readonly<ProductProps>) {
  const router = useRouter();
  const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  const handleClick = async () => {
    if (userEmail) {
      await registerClick({ productId: id, userEmail });
    }
    router.push(`/product/${id}`);
  };

  // Separar parte inteira e decimal
  const [integer, decimal] = price.toFixed(2).split(".");

  return (
    <button
      onClick={handleClick}
      className={`cursor-pointer flex flex-col h-[400px] w-[240px] ${width} mb-4 bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-shadow duration-100`}
    >
      {/* Imagem com área fixa */}
      <div className="bg-white w-full h-full p-0 flex items-center justify-center">
        <Image
          src={photo || "https://i.postimg.cc/pXsJJ92z/526867-200.png"}
          width={160}
          height={160}
          alt={name}
          className="min-w-full max-h-auto object-contain"
        />
      </div>

      <div className="flex flex-col gap-1 p-2 h-[140px]">
        {/* Nome do produto */}
        <p className={`text-[var(--text-dark)] font-bold line-clamp-2 ${OpenSans.className}`}>
          {name}
        </p>

        {/* Preço estilo Mercado Livre */}
        <div className={`flex items-start font-inter ${Inter.className} gap-0.5 justify-center text-[var(--text-dark)]`}>
          <span className="text-[20px]">R$ {integer}</span>
          <span className="text-xs mt-1 font-light"> {decimal}</span>
        </div>
      </div>
    </button>
  );
}