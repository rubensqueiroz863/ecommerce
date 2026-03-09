import { ProductPageProps } from "@/app/types/product" 
import ProductAdminClient from "./ProductAdminClient";

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  return ( 
    <ProductAdminClient id={id} />
  );
}