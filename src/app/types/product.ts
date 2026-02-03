export type ProductProps = {
  id: number;
  name: string;
  price: number;
  query: string;
  photo: string;
  width: string;
}

export type ProductCartProps = {
  id: number;
  name: string;
  price: number;
  query: string;
  photo: string;
  width: string;
  product: ProductProps;
}

export type ProductPageProps = {
  params: Promise<{
    id: number
  }>
}