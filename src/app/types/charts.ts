export type ClickClicksPerMonthDTO = {
  month: number;
  total: number;
};

export type ClickChartData = {
  month: string;
  clicks: number;
};

export type ProductsClicksPerMonthDTO = {
  productId: string;
  productName: string;
  month: number;
  clicks: number;
};

export type ProductsChartData = {
  month: string;
  productName: string;
  clicks: number;
};

export type RelatedProductDTO = {
  productId: string;
  productName: string;
  usersInCommon: number;
};

export type RecommendationDTO = {
  baseProduct: string;
  topRelatedProducts: RelatedProductDTO[];
};

export type RecommendationChartData = {
  baseProduct: string;
  relatedProductName: string;
  usersInCommon: number;
};