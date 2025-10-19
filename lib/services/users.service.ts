import { apiClient } from '../api';
import { ApiResponse } from '../types';
import { User, Business, Outlet } from './dashboard.service';

export interface CreateUserData {
  userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  userType: 'store_executive' | 'sales_rep';
  businessId: string;
  outletId: string;
}

export interface UserFilters {
  userType?: string;
  businessId?: string;
  outletId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: string;
}

export interface UserWithDetails extends User {
  business?: Business;
  outlet?: Outlet;
}

export class UsersService {
  async addUserToStore(data: CreateUserData): Promise<ApiResponse<{ user: User }>> {
    try {
      return await apiClient.post<ApiResponse<{ user: User }>>('/api/v1/users', data);
    } catch (error) {
      console.error('Error adding user:', error);
      return { 
        status: 'error', 
        message: 'Failed to add user',
        data: { user: {} as User }
      } as ApiResponse<{ user: User }>;
    }
  }

  async getUserById(id: string): Promise<ApiResponse<{ user: UserWithDetails }>> {
    try {
      return await apiClient.get<ApiResponse<{ user: UserWithDetails }>>(`/api/v1/users/${id}`);
    } catch (error) {
      console.error('Error fetching user:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch user',
        data: { user: {} as UserWithDetails }
      } as ApiResponse<{ user: UserWithDetails }>;
    }
  }

  async editUser(id: string, data: UpdateUserData): Promise<ApiResponse<{ user: User }>> {
    try {
      return await apiClient.put<ApiResponse<{ user: User }>>(`/api/v1/users/${id}`, data);
    } catch (error) {
      console.error('Error updating user:', error);
      return { 
        status: 'error', 
        message: 'Failed to update user',
        data: { user: {} as User }
      } as ApiResponse<{ user: User }>;
    }
  }

  async getUsers(filters?: UserFilters): Promise<ApiResponse<{ data: UserWithDetails[]; totalItems: number; totalPages: number; currentPage: number; itemsPerPage: number }>> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }
      const endpoint = `/api/v1/users${params.toString() ? `?${params.toString()}` : ''}`;
      return await apiClient.get<ApiResponse<{ data: UserWithDetails[]; totalItems: number; totalPages: number; currentPage: number; itemsPerPage: number }>>(endpoint);
    } catch (error) {
      console.error('Error fetching users:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch users',
        data: { data: [], totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 20 }
      } as ApiResponse<{ data: UserWithDetails[]; totalItems: number; totalPages: number; currentPage: number; itemsPerPage: number }>;
    }
  }

  // Legacy method for backward compatibility
  async getUsersByBusiness(businessId: string): Promise<ApiResponse<{ users: UserWithDetails[] }>> {
    try {
      const result = await this.getUsers({ businessId });
      return {
        status: result.status,
        message: result.message,
        data: { users: result.data?.data || [] }
      };
    } catch (error) {
      console.error('Error fetching users by business:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch users',
        data: { users: [] }
      } as ApiResponse<{ users: UserWithDetails[] }>;
    }
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<ApiResponse<void>>(`/api/v1/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      return { 
        status: 'error', 
        message: 'Failed to delete user'
      } as ApiResponse<void>;
    }
  }

  // Additional utility methods
  async getUsersByOutlet(outletId: string): Promise<ApiResponse<{ users: UserWithDetails[] }>> {
    try {
      const result = await this.getUsers({ outletId });
      return {
        status: result.status,
        message: result.message,
        data: { users: result.data?.data || [] }
      };
    } catch (error) {
      console.error('Error fetching users by outlet:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch users',
        data: { users: [] }
      } as ApiResponse<{ users: UserWithDetails[] }>;
    }
  }

  async getUsersByRole(userType: string): Promise<ApiResponse<{ users: UserWithDetails[] }>> {
    try {
      const result = await this.getUsers({ userType });
      return {
        status: result.status,
        message: result.message,
        data: { users: result.data?.data || [] }
      };
    } catch (error) {
      console.error('Error fetching users by role:', error);
      return { 
        status: 'error', 
        message: 'Failed to fetch users',
        data: { users: [] }
      } as ApiResponse<{ users: UserWithDetails[] }>;
    }
  }

  async searchUsers(search: string, filters?: Omit<UserFilters, 'search'>): Promise<ApiResponse<{ users: UserWithDetails[] }>> {
    try {
      const result = await this.getUsers({ ...filters, search });
      return {
        status: result.status,
        message: result.message,
        data: { users: result.data?.data || [] }
      };
    } catch (error) {
      console.error('Error searching users:', error);
      return { 
        status: 'error', 
        message: 'Failed to search users',
        data: { users: [] }
      } as ApiResponse<{ users: UserWithDetails[] }>;
    }
  }
}

export const usersService = new UsersService();
export default usersService;