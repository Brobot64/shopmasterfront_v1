import { api } from './api';

export const storeExecutiveDashboardService = {
  // Store Executive Dashboard
  async getStoreExecutiveDashboard(params?: any): Promise<any> {
    const response = await api.get('/dashboard/store-executive', { params });
    return response.data;
  },

  // Store Performance Metrics
  async getStorePerformance(params?: any): Promise<any> {
    const response = await api.get('/dashboard/store-executive/store-performance', { params });
    return response.data;
  },

  // Daily Sales Overview
  async getDailySales(params?: any): Promise<any> {
    const response = await api.get('/dashboard/store-executive/daily-sales', { params });
    return response.data;
  },

  // Staff Performance
  async getStaffPerformance(params?: any): Promise<any> {
    const response = await api.get('/dashboard/store-executive/staff-performance', { params });
    return response.data;
  },

  // Inventory Status
  async getInventoryStatus(params?: any): Promise<any> {
    const response = await api.get('/dashboard/store-executive/inventory-status', { params });
    return response.data;
  },

  // Sales Trends
  async getSalesTrends(params?: any): Promise<any> {
    const response = await api.get('/dashboard/store-executive/sales-trends', { params });
    return response.data;
  },

  // Customer Flow Analysis
  async getCustomerFlow(params?: any): Promise<any> {
    const response = await api.get('/dashboard/store-executive/customer-flow', { params });
    return response.data;
  },

  // Product Performance
  async getProductPerformance(params?: any): Promise<any> {
    const response = await api.get('/dashboard/store-executive/product-performance', { params });
    return response.data;
  },

  // Store Operations Summary
  async getOperationsSummary(params?: any): Promise<any> {
    const response = await api.get('/dashboard/store-executive/operations-summary', { params });
    return response.data;
  },

  // Revenue Tracking
  async getRevenueTracking(params?: any): Promise<any> {
    const response = await api.get('/dashboard/store-executive/revenue-tracking', { params });
    return response.data;
  }
};
