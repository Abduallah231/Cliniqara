export interface ApiResponse<T> {
  data: T;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
}