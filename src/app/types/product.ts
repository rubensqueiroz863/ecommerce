export type ProductProps = {
  id: string;
  name: string;
  price: number;
  query: string;
  photo: string;
  width: string;
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

export type ProductPageProps = {
  params: Promise<{
    id: string
  }>
}