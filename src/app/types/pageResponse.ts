export type PageResponse<T> = {
  data: T[];
  hasMore: boolean;
};