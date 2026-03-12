import { ProductPageProps } from "@/app/types/product";
import UsersAdminClient from "./UsersAdminClient";

export default async function UsersAdmin({ params }: ProductPageProps) {
  const { id } = await params;
  return ( 
    <UsersAdminClient id={id} />
  );
}