import { apiClient } from '../api';
import { User, CreateEmployeeRequest, ApiResponse, PaginatedResponse, UserRole, UserStatus } from '../types';
import { createErrorResponse, createErrorPaginatedResponse } from '../utils/api-response';

export interface EmployeeFilters {
  role?: UserRole;
  status?: UserStatus;
  businessId?: string;
  outletId?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export class EmployeesService {
  async getEmployees(filters?: EmployeeFilters, pagination?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      const params = {
        ...filters,
        ...pagination
      };
      return await apiClient.get<PaginatedResponse<User>>('/api/v1/users', { params });
    } catch (error) {
      console.error('Error fetching employees:', error);
      return createErrorPaginatedResponse<User>('Failed to fetch employees');
    }
  }

  async getEmployeeById(id: string): Promise<ApiResponse<User>> {
    try {
      return await apiClient.get<ApiResponse<User>>(`/api/v1/users/${id}`);
    } catch (error) {
      console.error('Error fetching employee by ID:', error);
      return createErrorResponse('Failed to fetch employee', {} as User);
    }
  }

  async createEmployee(employeeData: CreateEmployeeRequest): Promise<ApiResponse<User>> {
    try {
      return await apiClient.post<ApiResponse<User>>('/api/v1/users', employeeData);
    } catch (error) {
      console.error('Error creating employee:', error);
      return createErrorResponse('Failed to create employee', {} as User);
    }
  }

  async updateEmployee(id: string, employeeData: Partial<CreateEmployeeRequest>): Promise<ApiResponse<User>> {
    try {
      return await apiClient.put<ApiResponse<User>>(`/api/v1/users/${id}`, employeeData);
    } catch (error) {
      console.error('Error updating employee:', error);
      return createErrorResponse('Failed to update employee', {} as User);
    }
  }

  async deleteEmployee(id: string): Promise<ApiResponse<any>> {
    try {
      return await apiClient.delete<ApiResponse<any>>(`/api/v1/users/${id}`);
    } catch (error) {
      console.error('Error deleting employee:', error);
      return createErrorResponse('Failed to delete employee', undefined);
    }
  }

  async getEmployeesByBusiness(businessId: string, filters?: Omit<EmployeeFilters, 'businessId'>, pagination?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      const params = {
        ...filters,
        ...pagination,
        businessId
      };
      return await apiClient.get<PaginatedResponse<User>>('/api/v1/users', { params });
    } catch (error) {
      console.error('Error fetching employees by business:', error);
      return createErrorPaginatedResponse<User>('Failed to fetch employees');
    }
  }

  async createEmployeeForBusiness(businessId: string, employeeData: Omit<CreateEmployeeRequest, 'businessId'>): Promise<ApiResponse<User>> {
    try {
      return await this.createEmployee({ ...employeeData, businessId } as CreateEmployeeRequest);
    } catch (error) {
      console.error('Error creating employee for business:', error);
      return createErrorResponse('Failed to create employee', {} as User);
    }
  }

  async getEmployeesByOutlet(outletId: string, filters?: Omit<EmployeeFilters, 'outletId'>, pagination?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      const params = {
        ...filters,
        ...pagination,
        outletId
      };
      return await apiClient.get<PaginatedResponse<User>>('/api/v1/users', { params });
    } catch (error) {
      console.error('Error fetching employees by outlet:', error);
      return createErrorPaginatedResponse<User>('Failed to fetch employees');
    }
  }

  async assignEmployeeToOutlet(userId: string, outletId: string): Promise<ApiResponse<User>> {
    try {
      return await this.updateEmployee(userId, { outletId } as any);
    } catch (error) {
      console.error('Error assigning employee to outlet:', error);
      return createErrorResponse('Failed to assign employee to outlet', {} as User);
    }
  }

  async removeEmployeeFromOutlet(userId: string): Promise<ApiResponse<User>> {
    try {
      return await this.updateEmployee(userId, { outletId: null } as any);
    } catch (error) {
      console.error('Error removing employee from outlet:', error);
      return createErrorResponse('Failed to remove employee from outlet', {} as User);
    }
  }

  async updateEmployeeStatus(id: string, status: UserStatus): Promise<ApiResponse<User>> {
    try {
      return await this.updateEmployee(id, { status } as any);
    } catch (error) {
      console.error('Error updating employee status:', error);
      return createErrorResponse('Failed to update employee status', {} as User);
    }
  }

  async updateEmployeeRole(id: string, role: UserRole): Promise<ApiResponse<User>> {
    try {
      return await this.updateEmployee(id, { userType: role } as any);
    } catch (error) {
      console.error('Error updating employee role:', error);
      return createErrorResponse('Failed to update employee role', {} as User);
    }
  }

  async resetEmployeePassword(id: string): Promise<ApiResponse<{ temporaryPassword: string }>> {
    try {
      // This endpoint may not exist in backend, returning placeholder
      return createErrorResponse('Password reset not implemented', undefined);
    } catch (error) {
      console.error('Error resetting employee password:', error);
      return createErrorResponse('Failed to reset password', undefined);
    }
  }

  async sendEmployeeInvitation(email: string, role: UserRole, businessId?: string, outletId?: string): Promise<ApiResponse<any>> {
    try {
      // This endpoint may not exist in backend, returning placeholder
      return createErrorResponse('Employee invitation not implemented', undefined);
    } catch (error) {
      console.error('Error sending employee invitation:', error);
      return createErrorResponse('Failed to send invitation', undefined);
    }
  }

  async getEmployeeStats(filters?: {
    businessId?: string;
    outletId?: string;
  }): Promise<ApiResponse<{
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    suspendedEmployees: number;
    employeesByRole: Record<UserRole, number>;
    recentJoins: User[];
  }>> {
    try {
      const response = await this.getEmployees(filters);
      const employees = response.data || [];
      
      const stats = {
        totalEmployees: employees.length,
        activeEmployees: employees.filter(emp => (emp.status as string).toLowerCase() === 'active').length,
        inactiveEmployees: employees.filter(emp => (emp.status as string).toLowerCase() === 'inactive').length,
        suspendedEmployees: employees.filter(emp => (emp.status as string).toLowerCase() === 'suspended').length,
        employeesByRole: employees.reduce((acc, emp) => {
          acc[emp.userType as UserRole] = (acc[emp.userType as UserRole] || 0) + 1;
          return acc;
        }, {} as Record<UserRole, number>),
        recentJoins: employees.slice(0, 5) // Get first 5 as recent joins
      };
      
      return { status: 'success', data: stats };
    } catch (error) {
      console.error('Error calculating employee stats:', error);
      return {
        status: 'error',
        data: {
          totalEmployees: 0,
          activeEmployees: 0,
          inactiveEmployees: 0,
          suspendedEmployees: 0,
          employeesByRole: {} as Record<UserRole, number>,
          recentJoins: []
        },
        message: 'Failed to calculate employee stats'
      } as ApiResponse<any>;
    }
  }

  async getEmployeePerformance(userId: string, filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    salesCount: number;
    performanceRating: number;
    targets: {
      salesTarget: number;
      revenueTarget: number;
      salesAchieved: number;
      revenueAchieved: number;
    };
  }>> {
    try {
      // This endpoint may not exist in backend, returning placeholder
      return {
        status: 'error',
        message: 'Employee performance tracking not implemented'
      } as ApiResponse<any>;
    } catch (error) {
      console.error('Error fetching employee performance:', error);
      return { status: 'error', message: 'Failed to fetch employee performance' } as ApiResponse<any>;
    }
  }

  async getTopPerformingEmployees(filters?: {
    businessId?: string;
    outletId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<ApiResponse<Array<{
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    totalSales: number;
    totalRevenue: number;
    performanceScore: number;
  }>>> {
    try {
      // This endpoint may not exist in backend, returning placeholder
      return {
        status: 'error',
        message: 'Top performers tracking not implemented'
      } as ApiResponse<any>;
    } catch (error) {
      console.error('Error fetching top performing employees:', error);
      return { status: 'error', message: 'Failed to fetch top performers' } as ApiResponse<any>;
    }
  }

  async searchEmployees(query: string, filters?: EmployeeFilters, pagination?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      const params = {
        search: query,
        ...filters,
        ...pagination
      };
      return await apiClient.get<PaginatedResponse<User>>('/api/v1/users', { params });
    } catch (error) {
      console.error('Error searching employees:', error);
      return createErrorPaginatedResponse<User>('Failed to search employees');
    }
  }

  async bulkUpdateEmployees(updates: {
    id: string;
    data: Partial<{
      status: UserStatus;
      role: UserRole;
      outletId: string;
    }>;
  }[]): Promise<ApiResponse<User[]>> {
    try {
      // This endpoint may not exist in backend, returning placeholder
      return {
        status: 'error',
        message: 'Bulk update not implemented'
      } as ApiResponse<User[]>;
    } catch (error) {
      console.error('Error bulk updating employees:', error);
      return { status: 'error', message: 'Failed to bulk update employees' } as ApiResponse<User[]>;
    }
  }

  async bulkDeleteEmployees(userIds: string[]): Promise<ApiResponse<any>> {
    try {
      // This endpoint may not exist in backend, returning placeholder
      return {
        status: 'error',
        message: 'Bulk delete not implemented'
      } as ApiResponse<any>;
    } catch (error) {
      console.error('Error bulk deleting employees:', error);
      return { status: 'error', message: 'Failed to bulk delete employees' } as ApiResponse<any>;
    }
  }

  async getEmployeeActivity(userId: string, pagination?: PaginationParams): Promise<PaginatedResponse<{
    id: string;
    action: string;
    description: string;
    metadata?: any;
    createdAt: string;
  }>> {
    try {
      // This endpoint may not exist in backend, returning placeholder
      return createErrorPaginatedResponse('Employee activity tracking not implemented');
    } catch (error) {
      console.error('Error fetching employee activity:', error);
      return createErrorPaginatedResponse('Failed to fetch employee activity');
    }
  }

  async generateEmployeeReport(filters?: {
    businessId?: string;
    outletId?: string;
    role?: UserRole;
    status?: UserStatus;
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'csv' | 'pdf';
  }): Promise<ApiResponse<any>> {
    try {
      // This endpoint may not exist in backend, returning placeholder
      return {
        status: 'error',
        message: 'Employee report generation not implemented'
      } as ApiResponse<any>;
    } catch (error) {
      console.error('Error generating employee report:', error);
      return { status: 'error', message: 'Failed to generate employee report' } as ApiResponse<any>;
    }
  }
}

export const employeesService = new EmployeesService();
export default employeesService;