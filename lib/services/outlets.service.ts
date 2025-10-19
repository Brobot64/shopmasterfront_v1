import { apiClient } from '../api';
import { ApiResponse } from '../types';
import { Outlet, User, Product } from './dashboard.service';

export interface CreateOutletData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  managerId?: string;
}

export interface UpdateOutletData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  managerId?: string;
}

export interface OutletWithDetails extends Outlet {
  business?: any;
  users?: User[];
  products?: Product[];
}

export class OutletsService {
  async createOutlet(businessId: string, data: CreateOutletData): Promise<ApiResponse<{ outlet: Outlet }>> {
    try {
      return await apiClient.post<ApiResponse<{ outlet: Outlet }>>(`/api/v1/outlets/businesses/${businessId}/outlets`, data);
    } catch (error) {
      console.error('Error creating outlet:', error);
      return { 
        status: 'error', 
        message: 'Failed to create outlet',
        data: { outlet: {} as Outlet }
      } as ApiResponse<{ outlet: Outlet }>;
    }
  }

  async getOutletsByBusiness(businessId: string): Promise<ApiResponse<{ outlets: Outlet[] }>> {
    try {
      return await apiClient.get<ApiResponse<{ outlets: Outlet[] }>>(`/api/v1/outlets/businesses/${businessId}`);
    } catch (error) {
      console.error('Error fetching outlets:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch outlets',
        data: { outlets: [] }
      } as ApiResponse<{ outlets: Outlet[] }>;
    }
  }

  async getOutletById(id: string): Promise<ApiResponse<{ outlet: OutletWithDetails }>> {
    try {
      return await apiClient.get<ApiResponse<{ outlet: OutletWithDetails }>>(`/api/v1/outlets/${id}`);
    } catch (error) {
      console.error('Error fetching outlet:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch outlet',
        data: { outlet: {} as OutletWithDetails }
      } as ApiResponse<{ outlet: OutletWithDetails }>;
    }
  }

  async updateOutlet(id: string, data: UpdateOutletData): Promise<ApiResponse<{ outlet: Outlet }>> {
    try {
      return await apiClient.put<ApiResponse<{ outlet: Outlet }>>(`/api/v1/outlets/${id}`, data);
    } catch (error) {
      console.error('Error updating outlet:', error);
      return { 
        status: 'error', 
        message: 'Failed to update outlet',
        data: { outlet: {} as Outlet }
      } as ApiResponse<{ outlet: Outlet }>;
    }
  }

  async deleteOutlet(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<ApiResponse<void>>(`/api/v1/outlets/${id}`);
    } catch (error) {
      console.error('Error deleting outlet:', error);
      return { 
        status: 'error', 
        message: 'Failed to delete outlet'
      } as ApiResponse<void>;
    }
  }

  // Additional utility methods
  async getAllOutlets(): Promise<ApiResponse<{ outlets: Outlet[] }>> {
    try {
      return await apiClient.get<ApiResponse<{ outlets: Outlet[] }>>('/api/v1/outlets');
    } catch (error) {
      console.error('Error fetching all outlets:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch outlets',
        data: { outlets: [] }
      } as ApiResponse<{ outlets: Outlet[] }>;
    }
  }

  async getOutletUsers(outletId: string): Promise<ApiResponse<{ users: User[] }>> {
    try {
      // This would typically be handled by the users service with outlet filtering
      const outlet = await this.getOutletById(outletId);
      return {
        status: outlet.status,
        message: outlet.message,
        data: { users: outlet.data?.outlet?.users || [] }
      };
    } catch (error) {
      console.error('Error fetching outlet users:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch outlet users',
        data: { users: [] }
      } as ApiResponse<{ users: User[] }>;
    }
  }

  async getOutletProducts(outletId: string): Promise<ApiResponse<{ products: Product[] }>> {
    try {
      // This would typically be handled by the products service with outlet filtering
      const outlet = await this.getOutletById(outletId);
      return {
        status: outlet.status,
        message: outlet.message,
        data: { products: outlet.data?.outlet?.products || [] }
      };
    } catch (error) {
      console.error('Error fetching outlet products:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch outlet products',
        data: { products: [] }
      } as ApiResponse<{ products: Product[] }>;
    }
  }
}

export const outletsService = new OutletsService();
export default outletsService;