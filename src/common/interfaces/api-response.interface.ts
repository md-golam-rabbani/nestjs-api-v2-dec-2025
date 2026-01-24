/**
 * Standard error structure for API responses
 */
export interface ServerError {
  field?: string;
  message: string;
  code?: string;
}

/**
 * Standard API Response structure
 * Used for all successful and error responses
 */
export interface ApiResponse<T> {
  status: string | null;
  code: number | null;
  message: string | null;
  data: T | null;
  timestamp: string | null;
  errors: ServerError[] | null;
}

/**
 * Paginated Response structure
 * Used for list endpoints that return paginated data
 */
export interface PaginationResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  content: T | null;
}

/**
 * Response type that wraps data in pagination format
 */
export interface PaginatedApiResponse<T> extends ApiResponse<
  PaginationResponse<T>
> {}
