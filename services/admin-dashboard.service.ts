import { api } from './api';

export const adminDashboardService = {
  // Admin Dashboard Overview
  async getAdminDashboard(params?: any): Promise<any> {
    const response = await api.get('/dashboard/admin', { params });
    return response.data;
  },

  // System-wide Statistics
  async getSystemStatistics(params?: any): Promise<any> {
    const response = await api.get('/dashboard/admin/system-statistics', { params });
    return response.data;
  },

  // Business Management Overview
  async getBusinessManagementOverview(params?: any): Promise<any> {
    const response = await api.get('/dashboard/admin/business-overview', { params });
    return response.data;
  },

  // Subscription Analytics
  async getSubscriptionAnalytics(params?: any): Promise<any> {
    const response = await api.get('/dashboard/admin/subscription-analytics', { params });
    return response.data;
  },

  // Platform Revenue
  async getPlatformRevenue(params?: any): Promise<any> {
    const response = await api.get('/dashboard/admin/platform-revenue', { params });
    return response.data;
  },

  // User Activity Analytics
  async getUserActivityAnalytics(params?: any): Promise<any> {
    const response = await api.get('/dashboard/admin/user-activity', { params });
    return response.data;
  },

  // System Health Monitoring
  async getSystemHealth(params?: any): Promise<any> {
    const response = await api.get('/dashboard/admin/system-health', { params });
    return response.data;
  },

  // Business Growth Trends
  async getBusinessGrowthTrends(params?: any): Promise<any> {
    const response = await api.get('/dashboard/admin/business-growth', { params });
    return response.data;
  },

  // Top Performing Businesses
  async getTopPerformingBusinesses(params?: any): Promise<any> {
    const response = await api.get('/dashboard/admin/top-businesses', { params });
    return response.data;
  },

  // Support Ticket Analytics
  async getSupportTicketAnalytics(params?: any): Promise<any> {
    const response = await api.get('/dashboard/admin/support-analytics', { params });
    return response.data;
  },

  // Churn Analysis
  async getChurnAnalysis(params?: any): Promise<any> {
    const response = await api.get('/dashboard/admin/churn-analysis', { params });
    return response.data;
  }
};
