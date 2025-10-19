import { apiClient } from '../api';
import { ApiResponse, DashboardMetrics, ChartData } from '../types';
import { authService } from './auth.service';
import { businessService } from './business.service';

// Real API response interfaces based on Postman collection
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
}

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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  businessId: string;
  outletId: string | null;
  status: string;
}

export interface LogEntry {
  id: string;
  action: string;
  performerId: string;
  receiverId?: string;
  entityType: string;
  entityId: string;
  details?: any;
  timestamp: string;
  performer?: User;
  receiver?: User;
}

// Helper function to create error response
function createErrorResponse<T>(message: string, data: T): ApiResponse<T> {
  return {
    status: 'error',
    message,
    data
  };
}

export class DashboardService {
  // Owner Dashboard Methods
  async getOwnerTotalSales(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ totalSales: number }>>('/dashboard/owner/sales/total');
      return response.data?.totalSales || 0;
    } catch (error) {
      console.error('Error fetching owner total sales:', error);
      return 0;
    }
  }

  async getOwnerTotalRevenue(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ totalAmount: number }>>('/dashboard/owner/amount/total');
      return response.data?.totalAmount || 0;
    } catch (error) {
      console.error('Error fetching owner total revenue:', error);
      return 0;
    }
  }

  async getOwnerAvailableProductsWorth(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ totalValue: number }>>('/dashboard/owner/products/available');
      return response.data?.totalValue || 0;
    } catch (error) {
      console.error('Error fetching owner available products worth:', error);
      return 0;
    }
  }

  async getOwnerSalesOverTime(): Promise<ChartData[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ chartData: ChartData[] }>>('/dashboard/owner/sales/outlets-over-time');
      return response.data?.chartData || [];
    } catch (error) {
      console.error('Error fetching owner sales over time:', error);
      return [];
    }
  }

  async getOwnerTopCategories(): Promise<ChartData[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ categories: ChartData[] }>>('/dashboard/owner/products/top-categories');
      return response.data?.categories || [];
    } catch (error) {
      console.error('Error fetching owner top categories:', error);
      return [];
    }
  }

  async getOwnerTopPerformingOutlets(): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ outlets: any[] }>>('/dashboard/owner/outlets/top-performing');
      return response.data?.outlets || [];
    } catch (error) {
      console.error('Error fetching owner top performing outlets:', error);
      return [];
    }
  }

  async getOwnerRecentLogs(): Promise<LogEntry[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ logs: LogEntry[] }>>('/dashboard/owner/logs/recent');
      return response.data?.logs || [];
    } catch (error) {
      console.error('Error fetching owner recent logs:', error);
      return [];
    }
  }

  // Store Executive Dashboard Methods
  async getStoreExecutiveTotalSales(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ totalSales: number }>>('/dashboard/store-executive/sales/total');
      return response.data?.totalSales || 0;
    } catch (error) {
      console.error('Error fetching store executive total sales:', error);
      return 0;
    }
  }

  async getStoreExecutiveTotalRevenue(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ totalAmount: number }>>('/dashboard/store-executive/amount/total');
      return response.data?.totalAmount || 0;
    } catch (error) {
      console.error('Error fetching store executive total revenue:', error);
      return 0;
    }
  }

  async getStoreExecutiveAvailableProducts(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ totalProducts: number }>>('/dashboard/store-executive/products/available');
      return response.data?.totalProducts || 0;
    } catch (error) {
      console.error('Error fetching store executive available products:', error);
      return 0;
    }
  }

  async getStoreExecutiveSalesOverTime(): Promise<ChartData[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ chartData: ChartData[] }>>('/dashboard/store-executive/sales/over-time');
      return response.data?.chartData || [];
    } catch (error) {
      console.error('Error fetching store executive sales over time:', error);
      return [];
    }
  }

  async getStoreExecutiveTopCategories(): Promise<ChartData[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ categories: ChartData[] }>>('/dashboard/store-executive/products/top-categories');
      return response.data?.categories || [];
    } catch (error) {
      console.error('Error fetching store executive top categories:', error);
      return [];
    }
  }

  async getStoreExecutiveTopSalesReps(): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ salesReps: any[] }>>('/dashboard/store-executive/sales-reps/top-performing');
      return response.data?.salesReps || [];
    } catch (error) {
      console.error('Error fetching store executive top sales reps:', error);
      return [];
    }
  }

  async getStoreExecutiveRecentLogs(): Promise<LogEntry[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ logs: LogEntry[] }>>('/dashboard/store-executive/logs/recent');
      return response.data?.logs || [];
    } catch (error) {
      console.error('Error fetching store executive recent logs:', error);
      return [];
    }
  }

  // Sales Rep Dashboard Methods
  async getSalesRepTotalSales(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ totalSales: number }>>('/dashboard/sales-rep/sales/total');
      return response.data?.totalSales || 0;
    } catch (error) {
      console.error('Error fetching sales rep total sales:', error);
      return 0;
    }
  }

  async getSalesRepTotalRevenue(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ totalAmount: number }>>('/dashboard/sales-rep/amount/total');
      return response.data?.totalAmount || 0;
    } catch (error) {
      console.error('Error fetching sales rep total revenue:', error);
      return 0;
    }
  }

  async getSalesRepAvailableProducts(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ totalProducts: number }>>('/dashboard/sales-rep/products/available');
      return response.data?.totalProducts || 0;
    } catch (error) {
      console.error('Error fetching sales rep available products:', error);
      return 0;
    }
  }

  async getSalesRepPerformanceOverTime(): Promise<ChartData[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ chartData: ChartData[] }>>('/dashboard/sales-rep/performance/over-time');
      return response.data?.chartData || [];
    } catch (error) {
      console.error('Error fetching sales rep performance over time:', error);
      return [];
    }
  }

  async getSalesRepTopCategories(): Promise<ChartData[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ categories: ChartData[] }>>('/dashboard/sales-rep/products/top-categories');
      return response.data?.categories || [];
    } catch (error) {
      console.error('Error fetching sales rep top categories:', error);
      return [];
    }
  }

  async getSalesRepPeerComparison(): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ salesReps: any[] }>>('/dashboard/sales-rep/sales-reps/top-performing');
      return response.data?.salesReps || [];
    } catch (error) {
      console.error('Error fetching sales rep peer comparison:', error);
      return [];
    }
  }

  async getSalesRepRecentLogs(): Promise<LogEntry[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ logs: LogEntry[] }>>('/dashboard/sales-rep/logs/recent');
      return response.data?.logs || [];
    } catch (error) {
      console.error('Error fetching sales rep recent logs:', error);
      return [];
    }
  }

  // Admin Dashboard Methods
  async getAdminActiveOwners(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ count: number }>>('/dashboard/admin/users/active-owners');
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error fetching admin active owners:', error);
      return 0;
    }
  }

  async getAdminTotalRevenue(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ totalRevenue: number }>>('/dashboard/admin/revenue/total');
      return response.data?.totalRevenue || 0;
    } catch (error) {
      console.error('Error fetching admin total revenue:', error);
      return 0;
    }
  }

  async getAdminActiveUsers(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ count: number }>>('/dashboard/admin/users/active-total');
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error fetching admin active users:', error);
      return 0;
    }
  }

  async getAdminRevenueChartData(): Promise<ChartData[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ chartData: ChartData[] }>>('/dashboard/admin/revenue/chart-data');
      return response.data?.chartData || [];
    } catch (error) {
      console.error('Error fetching admin revenue chart data:', error);
      return [];
    }
  }

  async getAdminBusinessCategories(): Promise<ChartData[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ categories: ChartData[] }>>('/dashboard/admin/businesses/categories-pie-chart');
      return response.data?.categories || [];
    } catch (error) {
      console.error('Error fetching admin business categories:', error);
      return [];
    }
  }

  async getAdminRecentBusinesses(): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ businesses: any[] }>>('/dashboard/admin/businesses/recent-joined');
      return response.data?.businesses || [];
    } catch (error) {
      console.error('Error fetching admin recent businesses:', error);
      return [];
    }
  }

  // Legacy methods for backward compatibility
  async getBusiness(businessId: string): Promise<ApiResponse<{ business: Business }>> {
    try {
      return await businessService.getBusinessById(businessId);
    } catch (error) {
      console.error('Error fetching business:', error);
      return createErrorResponse('Failed to fetch business data', { business: null as any });
    }
  }

  async getOutlets(businessId: string): Promise<ApiResponse<{ outlets: Outlet[] }>> {
    try {
      return await apiClient.get<ApiResponse<{ outlets: Outlet[] }>>(`/outlets/businesses/${businessId}`);
    } catch (error) {
      console.error('Error fetching outlets:', error);
      return createErrorResponse('Failed to fetch outlets data', { outlets: [] });
    }
  }

  async getProducts(): Promise<ApiResponse<{ products: Product[] }>> {
    try {
      return await apiClient.get<ApiResponse<{ products: Product[] }>>('/products');
    } catch (error) {
      console.error('Error fetching products:', error);
      return createErrorResponse('Failed to fetch products data', { products: [] });
    }
  }

  async getUsers(): Promise<ApiResponse<{ users: User[] }>> {
    try {
      return await apiClient.get<ApiResponse<{ users: User[] }>>('/users');
    } catch (error) {
      console.error('Error fetching users:', error);
      return createErrorResponse('Failed to fetch users data', { users: [] });
    }
  }

  async getLogs(): Promise<ApiResponse<{ logs: LogEntry[] }>> {
    try {
      return await apiClient.get<ApiResponse<{ logs: LogEntry[] }>>('/logs');
    } catch (error) {
      console.error('Error fetching logs:', error);
      return createErrorResponse('Failed to fetch logs data', { logs: [] });
    }
  }

  // Aggregate dashboard data from multiple endpoints
  async getDashboardData(): Promise<{
    business: Business | null;
    outlets: Outlet[];
    products: Product[];
    users: User[];
    logs: LogEntry[];
    metrics: DashboardMetrics;
  }> {
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.businessId) {
        throw new Error('User not authenticated or missing business ID');
      }
      const businessId = user.businessId;
      // Fetch all data in parallel, with error handling for each
      const [businessRes, outletsRes, productsRes, usersRes, logsRes] = await Promise.allSettled([
        this.getBusiness(businessId),
        this.getOutlets(businessId),
        this.getProducts(),
        this.getUsers(),
        this.getLogs()
      ]);

      // Extract data with fallbacks
      const business = businessRes.status === 'fulfilled' ? businessRes.value.data.business : null;
      const outlets = outletsRes.status === 'fulfilled' ? outletsRes.value.data.outlets : [];
      const products = productsRes.status === 'fulfilled' ? productsRes.value.data.products : [];
      const users = usersRes.status === 'fulfilled' ? usersRes.value.data.users : [];
      const logs = logsRes.status === 'fulfilled' ? logsRes.value.data.logs : [];

      // Calculate metrics from the data
      const lowStockProducts = products.filter(product => 
        product.quantity <= product.reOrderPoint
      ).length;

      const inventoryValue = products.reduce((total, product) => 
        total + (product.price * product.quantity), 0
      );

      const metrics: DashboardMetrics = {
        totalProducts: products.length,
        totalOutlets: outlets.length,
        totalUsers: users.length,
        lowStockProducts,
        recentActivities: logs.slice(0, 10), // Get latest 10 activities
        inventoryValue
      };

      return {
        business,
        outlets,
        products,
        users,
        logs,
        metrics
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback data
      return {
        business: null,
        outlets: [],
        products: [],
        users: [],
        logs: [],
        metrics: {
          totalProducts: 0,
          totalOutlets: 0,
          totalUsers: 0,
          lowStockProducts: 0,
          recentActivities: [],
          inventoryValue: 0
        }
      };
      throw error;
    }
  }

  // Get just the metrics
  async getMetrics(): Promise<DashboardMetrics> {
    const dashboardData = await this.getDashboardData();
    return dashboardData.metrics;
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;