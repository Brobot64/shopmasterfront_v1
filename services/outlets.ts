import { api } from './api';
import { User } from './auth';
import { Business } from './business';

export interface Contact {
  name: string;
  value: string;
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  contact: Contact[];
  status: 'active' | 'inactive';
  imageUrl?: string;
  description?: string;
  businessId: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
  business?: Business;
  users?: User[];
  products?: any[];
}

export interface CreateOutletData {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  contact?: Contact[];
  imageUrl?: string;
  description?: string;
  businessId?: string; // Optional, will be set from auth context
}

export interface UpdateOutletData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  contact?: Contact[];
  imageUrl?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface OutletsResponse {
  status: string;
  data: Outlet[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface OutletResponse {
  status: string;
  data: {
    outlet: Outlet;
  };
}

export const outletsService = {
  async createOutlet(businessId: string, data: CreateOutletData): Promise<OutletResponse> {
    const response = await api.post(`/outlets/businesses/${businessId}/outlets`, data);
    return response.data;
  },

  async getOutlets(businessId: string, params?: any): Promise<OutletsResponse> {
    const response = await api.get(`/outlets/businesses/${businessId}`, { params });
    return response.data;
  },

  async getOutletById(id: string): Promise<OutletResponse> {
    const response = await api.get(`/outlets/${id}`);
    return response.data;
  },

  async updateOutlet(id: string, data: UpdateOutletData): Promise<OutletResponse> {
    const response = await api.put(`/outlets/${id}`, data);
    return response.data;
  },

  async deleteOutlet(id: string): Promise<any> {
    const response = await api.delete(`/outlets/${id}`);
    return response.data;
  },

  async getOutletStats(id: string, params?: any): Promise<any> {
    const response = await api.get(`/outlets/${id}/stats`, { params });
    return response.data;
  },

  async getOutletEmployees(id: string, params?: any): Promise<any> {
    const response = await api.get(`/outlets/${id}/employees`, { params });
    return response.data;
  },

  async assignManager(outletId: string, managerId: string): Promise<any> {
    const response = await api.post(`/outlets/${outletId}/manager`, { managerId });
    return response.data;
  },

  async removeManager(outletId: string): Promise<any> {
    const response = await api.delete(`/outlets/${outletId}/manager`);
    return response.data;
  },

  async activateOutlet(id: string): Promise<any> {
    const response = await api.post(`/outlets/${id}/activate`);
    return response.data;
  },

  async deactivateOutlet(id: string): Promise<any> {
    const response = await api.post(`/outlets/${id}/deactivate`);
    return response.data;
  }
};