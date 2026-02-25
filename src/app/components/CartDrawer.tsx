import { useCart } from "@/lib/cart";
import { motion } from "framer-motion";
import { ProductProps } from "../types/product";
import ProductCart from "./ProductCart";
import CloseCartButton from "./CloseCartButton";

export default function CartDrawer() {
  const cartMenu = useCart();
  return (
    // CartDrawer
    <>
      {/* Overlay */}
      <motion.div
        onClick={() => cartMenu.toggleCart()}
        className="
          fixed inset-0
          bg-black/40
          backdrop-blur-md
          z-40
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Drawer */}
      <motion.div
        className="
          fixed top-0 left-0
          xl:w-1/4
          md:w-3/6
          w-full
          h-screen
          bg-(--bg-secondary)
          z-50
          shadow-lg
          px-6
          pb-8
          gap-2
          overflow-auto
        "
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%"}}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="flex flex-row items-center justify-between w-full py-4 px-3">
          <p>Your Cart</p>
          <CloseCartButton />
        </div>
        <div className="w-full mb-8 px-2">
          <div className="w-full h-px bg-(--text-muted)" />
        </div>
        {cartMenu.cart.map((item: ProductProps) => 
          <ProductCart 
            key={item.id}
            width="" 
            query="" 
            id={item.id} 
            name={item.name} 
            price={item.price} 
            photo={item.photo} 
            product={item}
          />
        )}
      </motion.div>
    </>
  )
}