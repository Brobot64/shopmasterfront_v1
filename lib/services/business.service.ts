import { apiClient } from '../api';
import { ApiResponse } from '../types';
import { createErrorResponse } from '../utils/api-response';
import { Business } from './dashboard.service';

export interface UpdateBusinessData {
  name?: string;
  yearOfEstablishment?: number;
  category?: string;
  description?: string;
  address?: string;
  email?: string;
  contact?: Array<{name: string; value: string}>;
  imageUrl?: string;
}

export class BusinessService {
  async getBusinessById(businessId: string): Promise<ApiResponse<{ business: Business }>> {
    try {
      return await apiClient.get<ApiResponse<{ business: Business }>>(`/api/v1/businesses/${businessId}`);
    } catch (error) {
      console.error('Error fetching business:', error);
      return createErrorResponse('Failed to fetch business data', { business: {} as Business });
    }
  }

  async updateBusinessById(businessId: string, data: UpdateBusinessData): Promise<ApiResponse<{ business: Business }>> {
    try {
      return await apiClient.put<ApiResponse<{ business: Business }>>(`/api/v1/businesses/${businessId}`, data);
    } catch (error) {
      console.error('Error updating business:', error);
      return createErrorResponse('Failed to update business', { business: {} as Business });
    }
  }

  async getAllBusinesses(): Promise<ApiResponse<{ businesses: Business[] }>> {
    try {
      return await apiClient.get<ApiResponse<{ businesses: Business[] }>>('/api/v1/businesses');
    } catch (error) {
      console.error('Error fetching businesses:', error);
      return createErrorResponse('Failed to fetch businesses', { businesses: [] });
    }
  }

  async createBusiness(data: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ business: Business }>> {
    try {
      return await apiClient.post<ApiResponse<{ business: Business }>>('/api/v1/businesses', data);
    } catch (error) {
      console.error('Error creating business:', error);
      return createErrorResponse('Failed to create business', { business: {} as Business });
    }
  }

  async deleteBusiness(businessId: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<ApiResponse<void>>(`/api/v1/businesses/${businessId}`);
    } catch (error) {
      console.error('Error deleting business:', error);
      return createErrorResponse('Failed to delete business', undefined);
    }
  }

  async subscribeBusiness(businessId: string, subscriptionData: any): Promise<ApiResponse<{ business: Business }>> {
    try {
      return await apiClient.post<ApiResponse<{ business: Business }>>(`/api/v1/businesses/${businessId}/subscribe`, subscriptionData);
    } catch (error) {
      console.error('Error subscribing business:', error);
      return createErrorResponse('Failed to subscribe business', { business: {} as Business });
    }
  }
}

export const businessService = new BusinessService();
export default businessService;