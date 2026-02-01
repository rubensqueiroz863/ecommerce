import { CartState } from "@/app/types/cartState";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addProduct: (item) =>
        set((state) => {
          const exists = state.cart.find((p) => p.id === item.id);
          if (exists) return state; // não adiciona duplicado
          return { ...state, cart: [...state.cart, item] };
        }),
      removeProduct: (item) =>
        set((state) => ({
          ...state,
          cart: state.cart.filter((p) => p.id !== item.id),
        })),

      isOpen: false,
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      onCheckout: 'cart',
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'cart-storage' }
  )
);