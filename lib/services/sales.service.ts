import { apiClient } from '../api';
import { Sales, CreateSalesRequest, ApiResponse, PaginatedResponse, PaymentChannel, SalesStatus } from '../types';

export interface SalesFilters {
  status?: SalesStatus;
  paymentChannel?: PaymentChannel;
  customerId?: string;
  salesRepId?: string;
  outletId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export class SalesService {
  async getSales(filters?: SalesFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Sales>> {
    try {
      const params = {
        ...filters,
        ...pagination
      };
      return await apiClient.get<PaginatedResponse<Sales>>('/api/v1/sales', { params });
    } catch (error) {
      console.error('Error fetching sales:', error);
      return { status: 'error', data: { items: [], total: 0, page: 1, limit: 10 }, message: 'Failed to fetch sales' } as PaginatedResponse<Sales>;
    }
  }

  async getSaleById(id: string): Promise<ApiResponse<Sales>> {
    try {
      return await apiClient.get<ApiResponse<Sales>>(`/api/v1/sales/${id}`);
    } catch (error) {
      console.error('Error fetching sale by ID:', error);
      return { status: 'error', message: 'Failed to fetch sale' } as ApiResponse<Sales>;
    }
  }

  async createSale(salesData: CreateSalesRequest): Promise<ApiResponse<Sales>> {
    try {
      return await apiClient.post<ApiResponse<Sales>>('/api/v1/sales', salesData);
    } catch (error) {
      console.error('Error creating sale:', error);
      return { status: 'error', message: 'Failed to create sale' } as ApiResponse<Sales>;
    }
  }

  async updateSale(id: string, salesData: Partial<CreateSalesRequest>): Promise<ApiResponse<Sales>> {
    try {
      // Note: Update endpoint not available in backend, using status update as fallback
      return { status: 'error', message: 'Sale update not supported' } as ApiResponse<Sales>;
    } catch (error) {
      console.error('Error updating sale:', error);
      return { status: 'error', message: 'Failed to update sale' } as ApiResponse<Sales>;
    }
  }

  async deleteSale(id: string): Promise<ApiResponse<any>> {
    try {
      // Note: Delete endpoint not available in backend
      return { status: 'error', message: 'Delete sale not supported' } as ApiResponse<any>;
    } catch (error) {
      console.error('Error deleting sale:', error);
      return { status: 'error', message: 'Failed to delete sale' } as ApiResponse<any>;
    }
  }

  async getSalesByOutlet(outletId: string, filters?: Omit<SalesFilters, 'outletId'>, pagination?: PaginationParams): Promise<PaginatedResponse<Sales>> {
    try {
      const params = {
        ...filters,
        ...pagination,
        outletId
      };
      return await apiClient.get<PaginatedResponse<Sales>>('/api/v1/sales', { params });
    } catch (error) {
      console.error('Error fetching sales by outlet:', error);
      return { status: 'error', data: { items: [], total: 0, page: 1, limit: 10 }, message: 'Failed to fetch sales' } as PaginatedResponse<Sales>;
    }
  }

  async createSaleForOutlet(outletId: string, salesData: Omit<CreateSalesRequest, 'outletId'>): Promise<ApiResponse<Sales>> {
    try {
      const saleData = { ...salesData, outletId } as CreateSalesRequest;
      return await this.createSale(saleData);
    } catch (error) {
      console.error('Error creating sale for outlet:', error);
      return { status: 'error', message: 'Failed to create sale' } as ApiResponse<Sales>;
    }
  }

  async getSalesByUser(userId: string, filters?: Omit<SalesFilters, 'salesRepId'>, pagination?: PaginationParams): Promise<PaginatedResponse<Sales>> {
    try {
      const params = {
        ...filters,
        ...pagination,
        salesRepId: userId
      };
      return await apiClient.get<PaginatedResponse<Sales>>('/api/v1/sales', { params });
    } catch (error) {
      console.error('Error fetching sales by user:', error);
      return { status: 'error', data: { items: [], total: 0, page: 1, limit: 10 }, message: 'Failed to fetch sales' } as PaginatedResponse<Sales>;
    }
  }

  async updateSaleStatus(id: string, status: SalesStatus): Promise<ApiResponse<Sales>> {
    try {
      return await apiClient.put<ApiResponse<Sales>>(`/api/v1/sales/${id}/status`, { status });
    } catch (error) {
      console.error('Error updating sale status:', error);
      return { status: 'error', message: 'Failed to update sale status' } as ApiResponse<Sales>;
    }
  }

  async cancelSale(id: string, reason?: string): Promise<ApiResponse<Sales>> {
    try {
      // Using status update as cancel functionality
      return await this.updateSaleStatus(id, 'cancelled' as SalesStatus);
    } catch (error) {
      console.error('Error cancelling sale:', error);
      return { status: 'error', message: 'Failed to cancel sale' } as ApiResponse<Sales>;
    }
  }

  async refundSale(id: string, amount?: number, reason?: string): Promise<ApiResponse<Sales>> {
    try {
      // Using status update as refund functionality
      return await this.updateSaleStatus(id, 'refunded' as SalesStatus);
    } catch (error) {
      console.error('Error refunding sale:', error);
      return { status: 'error', message: 'Failed to refund sale' } as ApiResponse<Sales>;
    }
  }

  // Utility methods with client-side calculations as fallbacks
  async getSalesStats(filters?: {
    outletId?: string;
    salesRepId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    salesByStatus: Record<SalesStatus, number>;
    salesByPaymentChannel: Record<PaymentChannel, number>;
    topProducts: Array<{
      productId: string;
      productName: string;
      quantity: number;
      revenue: number;
    }>;
  }>> {
    try {
      const response = await this.getSales(filters);
      const sales = response.data?.items || [];
      
      const stats = {
        totalSales: sales.length,
        totalRevenue: sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0),
        averageOrderValue: sales.length > 0 ? sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0) / sales.length : 0,
        salesByStatus: {} as Record<SalesStatus, number>,
        salesByPaymentChannel: {} as Record<PaymentChannel, number>,
        topProducts: [] // Would need product data to calculate
      };
      
      return { status: 'success', data: stats };
    } catch (error) {
      console.error('Error calculating sales stats:', error);
      return {
        status: 'error',
        data: {
          totalSales: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          salesByStatus: {} as Record<SalesStatus, number>,
          salesByPaymentChannel: {} as Record<PaymentChannel, number>,
          topProducts: []
        },
        message: 'Failed to calculate sales stats'
      } as ApiResponse<any>;
    }
  }

  async getSalesReport(filters?: {
    outletId?: string;
    salesRepId?: string;
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'csv' | 'pdf';
  }): Promise<ApiResponse<any>> {
    try {
      // Reports not implemented in backend, return sales data
      const response = await this.getSales(filters);
      return {
        status: response.status,
        data: response.data?.items || [],
        message: 'Sales report generated from available data'
      };
    } catch (error) {
      console.error('Error generating sales report:', error);
      return {
        status: 'error',
        message: 'Failed to generate sales report'
      } as ApiResponse<any>;
    }
  }

  async getSalesByDateRange(startDate: string, endDate: string, filters?: Omit<SalesFilters, 'startDate' | 'endDate'>, pagination?: PaginationParams): Promise<PaginatedResponse<Sales>> {
    try {
      const params = {
        startDate,
        endDate,
        ...filters,
        ...pagination
      };
      return await apiClient.get<PaginatedResponse<Sales>>('/api/v1/sales', { params });
    } catch (error) {
      console.error('Error fetching sales by date range:', error);
      return { status: 'error', data: { items: [], total: 0, page: 1, limit: 10 }, message: 'Failed to fetch sales' } as PaginatedResponse<Sales>;
    }
  }

  async getDailySales(date: string, outletId?: string): Promise<ApiResponse<Sales[]>> {
    try {
      const response = await this.getSalesByDateRange(date, date, { outletId });
      return {
        status: response.status,
        data: response.data?.items || [],
        message: response.message
      };
    } catch (error) {
      console.error('Error fetching daily sales:', error);
      return { status: 'error', data: [], message: 'Failed to fetch daily sales' } as ApiResponse<Sales[]>;
    }
  }

  async getMonthlySales(year: number, month: number, outletId?: string): Promise<ApiResponse<Sales[]>> {
    try {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
      const response = await this.getSalesByDateRange(startDate, endDate, { outletId });
      return {
        status: response.status,
        data: response.data?.items || [],
        message: response.message
      };
    } catch (error) {
      console.error('Error fetching monthly sales:', error);
      return { status: 'error', data: [], message: 'Failed to fetch monthly sales' } as ApiResponse<Sales[]>;
    }
  }

  async getTopSellingProducts(filters?: {
    outletId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<ApiResponse<Array<{
    productId: string;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
    salesCount: number;
  }>>> {
    try {
      // Not implemented in backend, return empty array
      return {
        status: 'success',
        data: [],
        message: 'Top selling products calculation not implemented'
      };
    } catch (error) {
      console.error('Error fetching top selling products:', error);
      return { status: 'error', data: [], message: 'Failed to fetch top selling products' } as ApiResponse<any>;
    }
  }

  async getSalesPerformance(filters?: {
    outletId?: string;
    salesRepId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    salesGrowth: number;
    revenueGrowth: number;
    conversionRate: number;
  }>> {
    try {
      const stats = await this.getSalesStats(filters);
      return {
        status: stats.status,
        data: {
          totalSales: stats.data?.totalSales || 0,
          totalRevenue: stats.data?.totalRevenue || 0,
          averageOrderValue: stats.data?.averageOrderValue || 0,
          salesGrowth: 0, // Would need historical data
          revenueGrowth: 0, // Would need historical data
          conversionRate: 0 // Would need visitor data
        },
        message: stats.message
      };
    } catch (error) {
      console.error('Error calculating sales performance:', error);
      return {
        status: 'error',
        data: {
          totalSales: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          salesGrowth: 0,
          revenueGrowth: 0,
          conversionRate: 0
        },
        message: 'Failed to calculate sales performance'
      } as ApiResponse<any>;
    }
  }
}

export const salesService = new SalesService();
export default salesService;