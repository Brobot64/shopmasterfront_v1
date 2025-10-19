import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      withCredentials: true, // Important for cookie-based auth
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - cookies are handled automatically
    this.client.interceptors.request.use(
      (config) => {
        // No need to manually add token, cookies are handled automatically
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for comprehensive error handling
    this.client.interceptors.response.use(
      (response) => {
        // Handle successful responses
        return response;
      },
      (error) => {
        // Handle different types of errors
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              // Unauthorized - user needs to login
              if (typeof window !== 'undefined') {
                localStorage.clear();
                sessionStorage.clear();
                // Only redirect if not already on auth pages
                const currentPath = window.location.pathname;
                if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register') && !currentPath.startsWith('/auth')) {
                  window.location.href = '/login';
                }
              }
              break;
              
            case 403:
              // Forbidden - insufficient permissions
              if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                if (!currentPath.startsWith('/unauthorized')) {
                  window.location.href = '/unauthorized';
                }
              }
              break;
              
            case 404:
              // Not found - API endpoint doesn't exist
              console.error(`API endpoint not found: ${error.config?.url}`);
              break;
              
            case 400:
              // Bad request - validation errors
              console.error('Validation error:', data?.message || 'Invalid request');
              break;
              
            case 409:
              // Conflict - resource already exists
              console.error('Conflict error:', data?.message || 'Resource conflict');
              break;
              
            case 500:
            case 502:
            case 503:
            case 504:
              // Server errors
              console.error('Server error:', data?.message || 'Internal server error');
              break;
              
            default:
              console.error(`HTTP ${status} error:`, data?.message || 'Unknown error');
          }
          
          // Enhance error object with standardized format
          const enhancedError = {
            ...error,
            message: data?.message || error.message,
            status: data?.status || 'error',
            statusCode: status,
            isOperational: data?.error?.isOperational || false,
            response: {
              ...error.response,
              data: {
                status: data?.status || 'error',
                message: data?.message || error.message,
                error: data?.error || {
                  statusCode: status,
                  status: status >= 500 ? 'error' : 'fail',
                  isOperational: data?.error?.isOperational || false
                },
                stack: data?.stack // Only available in development
              }
            }
          };
          
          return Promise.reject(enhancedError);
        } else if (error.request) {
          // Network error - no response received
          console.error('Network error:', error.message);
          const networkError = {
            ...error,
            message: 'Network error. Please check your internet connection.',
            status: 'error',
            statusCode: 0,
            isOperational: false
          };
          return Promise.reject(networkError);
        } else {
          // Request setup error
          console.error('Request setup error:', error.message);
          return Promise.reject(error);
        }
      }
    );
  }

  // Token methods removed - using cookie-based authentication

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;