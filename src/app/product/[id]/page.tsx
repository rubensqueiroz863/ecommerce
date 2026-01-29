import { ProductPageProps } from "@/app/types/product" 
import ProductClient from "./ProductClient";

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  return ( 
    <ProductClient id={id} />
  );
}