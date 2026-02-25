import Image from "next/image";
import { ProductCartProps } from "../types/product";
import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";

function isAuthenticated() {
  if (globalThis.window === undefined) return false;
  return !!localStorage.getItem("token");
}

export default function ProductCart({ id, name, price, photo, width, product  }: ProductCartProps) {
  const cart = useCart();
  const router = useRouter();

  const handleBuy = () => {
    if (!isAuthenticated()) {
      router.push(`/login?redirect=/product/${id}`);
      return;
    }

    console.log("Comprar produto:", product);
  };

  return (
    // Card do produto
    <div
      className={`flex flex-col ${width} mb-4 bg-(--bg-card) rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden`}>
      { /* Foto do produto */}
      <div className="flex items-center justify-center bg-white p-4">
        <Image
          src={"https://i.postimg.cc/pXsJJ92z/526867-200.png"}
          width={800}
          height={800}
          alt="Product photo"
          className="h-56 w-auto object-contain"
        />
      </div>
      { /* Nome e preço */}
      <div className="flex flex-col gap-1 p-4">
        <p className="text-(--text-main) font-medium line-clamp-2">
          {name}
        </p>

        <p className="text-(--success) font-semibold text-lg">
          R$ {price}
        </p>
        <button
          className="py-1 px-2 bg-red-600 hover:opacity-90 transition-all cursor-pointer rounded-md mt-2 text-sm"
          onClick={() => cart.removeProduct(product)}
        >
          Remover Produto
        </button>
        <button 
          onClick={handleBuy}
          className="py-1 px-2 bg-green-600 hover:opacity-90 transition-all cursor-pointer rounded-md mt-2 text-sm"
        >
          Comprar Produto
        </button>
      </div>
    </div>
  )
}