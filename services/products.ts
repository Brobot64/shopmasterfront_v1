import { api } from './api';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
  tags?: string[];
  imageUrl?: string;
  minPrice?: number;
  skuNumber: string;
  reOrderPoint: number;
  businessId: string;
  outletId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
  tags?: string[];
  imageUrl?: string;
  minPrice?: number;
  skuNumber: string;
  reOrderPoint: number;
  outletId?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  minPrice?: number;
  skuNumber?: string;
  reOrderPoint?: number;
}

export interface ProductResponse {
  status: string;
  data: {
    product: Product;
  };
}

export interface ProductsResponse {
  status: string;
  data: {
    products: Product[];
  };
}

export const productsService = {
  async addProduct(data: any, outletId: any): Promise<any> {
    const response = await api.post(`/products/outlets/${outletId}/products`, data);
    return response.data;
  },

  async getProducts(params?: any): Promise<any> {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getProductById(id: string): Promise<any> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async updateProduct(id: string, data: any): Promise<any> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<any> {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Additional product endpoints
  async searchProducts(params?: any): Promise<any> {
    const response = await api.get('/products/search', { params });
    return response.data;
  },

  async getProductsByCategory(category: string, params?: any): Promise<any> {
    const response = await api.get(`/products/category/${category}`, { params });
    return response.data;
  },

  async getProductsByOutlet(outletId: string, params?: any): Promise<any> {
    const response = await api.get(`/products/outlets/${outletId}/products`, { params });
    return response.data;
  },

  async bulkUpdateProducts(data: any): Promise<any> {
    const response = await api.put('/products/bulk-update', data);
    return response.data;
  },

  async bulkDeleteProducts(data: any): Promise<any> {
    const response = await api.delete('/products/bulk-delete', { data });
    return response.data;
  }
};
