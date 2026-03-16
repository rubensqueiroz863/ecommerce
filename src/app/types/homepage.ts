import { ProductProps } from "./product";

export interface MostClickedProductDTO {
  product: ProductProps;
  clicks: number;
}

export interface UserRecommendation {
  productId: string;
  productName: string;
  productPrice: number;
  usersInCommon: number;
}

export interface UserRecommendationGroup {
  userId: string;
  userName: string;
  recommendations: UserRecommendation[];
}