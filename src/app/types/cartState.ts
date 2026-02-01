import { ProductProps } from "./product"

export type CartState = {
  cart: ProductProps[];
  addProduct: (product: ProductProps) => void;
  removeProduct: (product: ProductProps) => void;
  isOpen: boolean;
  toggleCart: () => void;
  clearCart: () => void;
}