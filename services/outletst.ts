import { api } from './api';
import { User } from './auth';
import { Business } from './business';

export interface Outlet {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  businessId: string;
  managerId?: string;
  status: string;
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
  businessId: string;
  managerId?: string;
}

export interface OutletsResponse {
  status: string;
  data: {
    outlets: Outlet[];
  };
}

export interface OutletResponse {
  status: string;
  data: {
    outlet: Outlet;
  };
}

export const outletsService = {
  async createOutlet(data: any): Promise<any> {
    const response = await api.post('/outlets', data);
    return response.data;
  },

  async getOutletsByBusiness(params?: any): Promise<any> {
    const response = await api.get('/outlets', { params });
    return response.data;
  },

  async getOutletById(id: string): Promise<any> {
    const response = await api.get(`/outlets/${id}`);
    return response.data;
  },

  async updateOutlet(id: string, data: any): Promise<any> {
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
