import { ApiResponse, PaginatedResponse } from '../types';

export function createErrorResponse<T>(message: string, data?: T): ApiResponse<T> {
  return {
    success: false,
    data: data as T,
    message
  };
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  };
}

export function createErrorPaginatedResponse<T>(message: string): PaginatedResponse<T> {
  return {
    success: false,
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  };
}

export function createSuccessPaginatedResponse<T>(
  data: T[], 
  pagination: { page: number; limit: number; total: number; totalPages: number }
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination
  };
}
