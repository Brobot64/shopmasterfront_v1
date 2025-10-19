// services/users.ts (updated with proper types)
import { api } from './api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  status: 'active' | 'suspended' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Business {
  id: string;
  name: string;
  yearOfEstablishment?: number;
  category?: string;
  description?: string;
  address?: string;
  email?: string;
  contact?: Array<{
    name: string;
    value: string;
  }>;
  imageUrl?: string;
  status?: string;
}

export interface Outlet {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  contact?: Array<{
    name: string;
    value: string;
  }>;
  status?: string;
  imageUrl?: string;
  description?: string;
}

export interface UserWithDetails extends User {
  business?: Business;
  outlet?: Outlet;
  businessId?: string;
  outletId?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AddUserToStoreData {
  userData: CreateUserData;
  userType: string;
  businessId: string;
  outletId?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  userType?: string;
  status?: 'active' | 'suspended' | 'inactive';
  outletId?: string;
}

export interface UsersResponse {
  status: string;
  data: UserWithDetails[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface UserResponse {
  status: string;
  data: {
    user: UserWithDetails;
  };
}

export const usersService = {
  async createUser(data: CreateUserData): Promise<UserResponse> {
    const response = await api.post('/users', data);
    return response.data;
  },

  async addUserToStore(data: AddUserToStoreData): Promise<UserResponse> {
    const response = await api.post('/users', data);
    return response.data;
  },

  async getUserById(id: string): Promise<UserResponse> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserData): Promise<UserResponse> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<any> {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async getUsers(params?: any): Promise<UsersResponse> {
    const response = await api.get('/users', { params });
    return response.data;
  },

  async getUsersByBusiness(businessId: string): Promise<UsersResponse> {
    const response = await api.get('/users', { params: { businessId } });
    return response.data;
  },

  async getUsersByOutlet(outletId: string): Promise<UsersResponse> {
    const response = await api.get('/users', { params: { outletId } });
    return response.data;
  },

  // Legacy method for backward compatibility
  editUser: function(id: string, data: UpdateUserData): Promise<UserResponse> {
    return this.updateUser(id, data);
  }
};