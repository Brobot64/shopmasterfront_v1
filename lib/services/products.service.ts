import { apiClient } from '../api';
import { ApiResponse } from '../types';
import { Product, Business, Outlet } from './dashboard.service';

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category: string;
  sku: string;
  stockQuantity?: number;
  minStockLevel?: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  sku?: string;
  stockQuantity?: number;
  minStockLevel?: number;
}

export interface ProductWithDetails extends Product {
  business?: Business;
  outlet?: Outlet;
}

export interface ProductFilters {
  outletId?: string;
  businessId?: string;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export class ProductsService {
  async addProduct(outletId: string, data: CreateProductData): Promise<ApiResponse<{ product: Product }>> {
    try {
      return await apiClient.post<ApiResponse<{ product: Product }>>(`/api/v1/products/outlets/${outletId}/products`, data);
    } catch (error) {
      console.error('Error adding product:', error);
      return { 
        status: 'error', 
        message: 'Failed to add product',
        data: { product: {} as Product }
      } as ApiResponse<{ product: Product }>;
    }
  }

  async getProducts(filters?: ProductFilters): Promise<ApiResponse<{ products: ProductWithDetails[] }>> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      const endpoint = `/api/v1/products${params.toString() ? `?${params.toString()}` : ''}`;
      return await apiClient.get<ApiResponse<{ products: ProductWithDetails[] }>>(endpoint);
    } catch (error) {
      console.error('Error fetching products:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch products',
        data: { products: [] }
      } as ApiResponse<{ products: ProductWithDetails[] }>;
    }
  }

  async getProductById(id: string): Promise<ApiResponse<{ product: ProductWithDetails }>> {
    try {
      return await apiClient.get<ApiResponse<{ product: ProductWithDetails }>>(`/api/v1/products/${id}`);
    } catch (error) {
      console.error('Error fetching product:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch product',
        data: { product: {} as ProductWithDetails }
      } as ApiResponse<{ product: ProductWithDetails }>;
    }
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<ApiResponse<{ product: Product }>> {
    try {
      return await apiClient.put<ApiResponse<{ product: Product }>>(`/api/v1/products/${id}`, data);
    } catch (error) {
      console.error('Error updating product:', error);
      return { 
        status: 'error', 
        message: 'Failed to update product',
        data: { product: {} as Product }
      } as ApiResponse<{ product: Product }>;
    }
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<ApiResponse<void>>(`/api/v1/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      return { 
        status: 'error', 
        message: 'Failed to delete product'
      } as ApiResponse<void>;
    }
  }

  // Additional utility methods
  async getProductsByOutlet(outletId: string): Promise<ApiResponse<{ products: ProductWithDetails[] }>> {
    try {
      return await this.getProducts({ outletId });
    } catch (error) {
      console.error('Error fetching products by outlet:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch products',
        data: { products: [] }
      } as ApiResponse<{ products: ProductWithDetails[] }>;
    }
  }

  async getProductsByBusiness(businessId: string): Promise<ApiResponse<{ products: ProductWithDetails[] }>> {
    try {
      return await this.getProducts({ businessId });
    } catch (error) {
      console.error('Error fetching products by business:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch products',
        data: { products: [] }
      } as ApiResponse<{ products: ProductWithDetails[] }>;
    }
  }

  async getProductsByCategory(category: string, filters?: Omit<ProductFilters, 'category'>): Promise<ApiResponse<{ products: ProductWithDetails[] }>> {
    try {
      return await this.getProducts({ ...filters, category });
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch products',
        data: { products: [] }
      } as ApiResponse<{ products: ProductWithDetails[] }>;
    }
  }

  async searchProducts(search: string, filters?: Omit<ProductFilters, 'search'>): Promise<ApiResponse<{ products: ProductWithDetails[] }>> {
    try {
      return await this.getProducts({ ...filters, search });
    } catch (error) {
      console.error('Error searching products:', error);
      return { 
        status: 'error', 
        message: 'Failed to search products',
        data: { products: [] }
      } as ApiResponse<{ products: ProductWithDetails[] }>;
    }
  }

  async getLowStockProducts(filters?: ProductFilters): Promise<ApiResponse<{ products: ProductWithDetails[] }>> {
    try {
      // This would need to be implemented on the backend or filtered client-side
      const result = await this.getProducts(filters);
      const lowStockProducts = result.data?.products?.filter(product => 
        product.stockQuantity !== undefined && 
        product.minStockLevel !== undefined && 
        product.stockQuantity <= product.minStockLevel
      ) || [];
      
      return {
        status: result.status,
        message: result.message,
        data: { products: lowStockProducts }
      };
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch low stock products',
        data: { products: [] }
      } as ApiResponse<{ products: ProductWithDetails[] }>;
    }
  }

  async getOutOfStockProducts(filters?: ProductFilters): Promise<ApiResponse<{ products: ProductWithDetails[] }>> {
    try {
      // This would need to be implemented on the backend or filtered client-side
      const result = await this.getProducts(filters);
      const outOfStockProducts = result.data?.products?.filter(product => 
        product.stockQuantity === 0
      ) || [];
      
      return {
        status: result.status,
        message: result.message,
        data: { products: outOfStockProducts }
      };
    } catch (error) {
      console.error('Error fetching out of stock products:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch out of stock products',
        data: { products: [] }
      } as ApiResponse<{ products: ProductWithDetails[] }>;
    }
  }
}

export const productsService = new ProductsService();
export default productsService;