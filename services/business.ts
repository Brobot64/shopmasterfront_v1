import { api } from './api';

export interface Business {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessResponse {
  status: string;
  data: {
    business: Business;
  };
}

export interface UpdateBusinessData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
}

export const businessService = {
  async getBusinessByOwner(): Promise<BusinessResponse> {
    const response = await api.get('/business/owner');
    return response.data;
  },

  async updateBusinessByOwner(data: UpdateBusinessData): Promise<BusinessResponse> {
    const response = await api.put('/business/owner', data);
    return response.data;
  }
};