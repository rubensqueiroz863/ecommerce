import { useCart } from "@/lib/cart";

export default function Cart() {

  const cart = useCart();
  return (
    <button
      onClick={() => cart.toggleCart()}
      className="cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 md:h-4.5 xl:w-5 xl:h-5 text-(--text-light) transition-all hover:opacity-70 md:translate-y-0.5 md:w-4.5"
          width="20"
          height="20"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round">

        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>

        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 
                2 1.61h9.72a2 2 0 0 0 
                2-1.61L23 6H6"></path>
      </svg>
    </button>
  );
}