import { useCart } from "@/lib/cart";

export default function CloseCartButton() {
  const cart = useCart();

  return (
    <button
      onClick={cart.toggleCart}
      aria-label="Fechar carrinho"
      className="
        relative
        w-8 h-8
        flex items-center justify-center
        cursor-pointer
        hover:opacity-70
        transition
        md:hidden
      "
    >
      {/* Linha 1 */}
      <span
        className="
          absolute
          w-5.5 h-[3px]
          bg-(--text-main)
          rounded-md
          rotate-45
        "
      />

      {/* Linha 2 */}
      <span
        className="
          absolute
          w-5.5 h-[3px]
          bg-(--text-main)
          rounded-md
          -rotate-45
        "
      />
    </button>
  );
}
