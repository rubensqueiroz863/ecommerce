export type ProductProps = {
  id: number;
  name: string;
  price: number;
  query: string;
  photo: string;
  width: string;
<<<<<<< docs/projectOrganization
=======
  role: "user" | "admin";
}

export type ProductCartProps = {
  id: string;
  name: string;
  price: number;
  query: string;
  photo: string;
  width: string;
  product: ProductProps;
}

export type ProductClientProps = {
  id: string;
};

export type ProductPageProps = {
  params: Promise<{
    id: string
  }>
>>>>>>> local
}