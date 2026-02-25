"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductProps } from "../types/product";

type ClickRequest = {
  productId: string;
  userEmail: string;
};

async function registerClick(clickEvent: ClickRequest) {
  const response = await fetch(
    "https://sticky-charil-react-blog-3b39d9e9.koyeb.app/events/click",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clickEvent),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao registrar click");
  }

  return response.json();
}

export default function Product({
  id,
  name,
  price,
  width,
}: Readonly<ProductProps>) {
  const router = useRouter();

  const userEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("userEmail")
      : null;

  const handleClick = async () => {
    try {
      if (userEmail) {
        await registerClick({
          productId: id,
          userEmail,
        });
      }
    } catch (error) {
      console.error(error);
    }

    router.push(`/product/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer flex flex-col ${width} mb-4 bg-(--bg-card) rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden`}
    >
      <div className="flex items-center justify-center bg-white p-4">
        <Image
          src="https://i.postimg.cc/pXsJJ92z/526867-200.png"
          width={800}
          height={800}
          alt="Product photo"
          className="h-56 w-auto object-contain"
        />
      </div>

      <div className="flex flex-col gap-1 p-4">
        <p className="text-(--text-main) font-medium line-clamp-2">
          {name}
        </p>

        <p className="text-(--success) font-semibold text-lg">
          R$ {price}
        </p>
      </div>
    </div>
  );
}