import { api } from './api';

export const salesRepDashboardService = {
  // Sales Rep Dashboard
  async getSalesRepDashboard(params?: any): Promise<any> {
    const response = await api.get('/dashboard/sales-rep', { params });
    return response.data;
  },

  // Personal Sales Performance
  async getPersonalSalesPerformance(params?: any): Promise<any> {
    const response = await api.get('/dashboard/sales-rep/personal-performance', { params });
    return response.data;
  },

  // Daily Sales Targets
  async getDailySalesTargets(params?: any): Promise<any> {
    const response = await api.get('/dashboard/sales-rep/daily-targets', { params });
    return response.data;
  },

  // Commission Tracking
  async getCommissionTracking(params?: any): Promise<any> {
    const response = await api.get('/dashboard/sales-rep/commission-tracking', { params });
    return response.data;
  },

  // Customer Interactions
  async getCustomerInteractions(params?: any): Promise<any> {
    const response = await api.get('/dashboard/sales-rep/customer-interactions', { params });
    return response.data;
  },

  // Products Sold
  async getProductsSold(params?: any): Promise<any> {
    const response = await api.get('/dashboard/sales-rep/products-sold', { params });
    return response.data;
  },

  // Sales Activities
  async getSalesActivities(params?: any): Promise<any> {
    const response = await api.get('/dashboard/sales-rep/sales-activities', { params });
    return response.data;
  },

  // Performance Rankings
  async getPerformanceRankings(params?: any): Promise<any> {
    const response = await api.get('/dashboard/sales-rep/performance-rankings', { params });
    return response.data;
  },

  // Monthly Goals Progress
  async getMonthlyGoalsProgress(params?: any): Promise<any> {
    const response = await api.get('/dashboard/sales-rep/monthly-goals', { params });
    return response.data;
  },

  // Recent Sales History
  async getRecentSalesHistory(params?: any): Promise<any> {
    const response = await api.get('/dashboard/sales-rep/recent-sales', { params });
    return response.data;
  }
};
