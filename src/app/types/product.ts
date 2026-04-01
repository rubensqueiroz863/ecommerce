export type ProductProps = {
  id: string;
  name: string;
  price: number;
  query: string;
  photo: string;
  width: string;
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
}

export type ProductLog = {
  id: string;
  productId: string;
  performedBy: string;
  action: string;
  details: string;
  timestamp: string;
};