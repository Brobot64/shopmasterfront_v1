import { api } from './api';

export const usersService = {
  async createUser(data: any): Promise<any> {
    const response = await api.post('/users', data);
    return response.data;
  },

  async addUserToStore(data: any): Promise<any> {
    const response = await api.post('/users/store', data);
    return response.data;
  },

  async getUserById(id: string): Promise<any> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: any): Promise<any> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<any> {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async getUsers(params?: any): Promise<any> {
    const response = await api.get('/users', { params });
    return response.data;
  },

  async getUsersByBusiness(businessId: string): Promise<any> {
    const response = await api.get('/users', { params: { businessId } });
    return response.data;
  },

  async getUsersByOutlet(outletId: string): Promise<any> {
    const response = await api.get('/users', { params: { outletId } });
    return response.data;
  },

  // Legacy method for backward compatibility
  editUser: function(id: string, data: any): Promise<any> {
    return this.updateUser(id, data);
  }
};
