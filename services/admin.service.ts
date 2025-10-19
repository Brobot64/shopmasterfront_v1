import { api } from './api';

export const adminService = {
  // Subscription Management
  async getAllSubscriptions(params?: any): Promise<any> {
    const response = await api.get('/admin/subscriptions', { params });
    return response.data;
  },

  async createSubscription(data: any): Promise<any> {
    const response = await api.post('/admin/subscriptions', data);
    return response.data;
  },

  async getSubscriptionById(id: string): Promise<any> {
    const response = await api.get(`/admin/subscriptions/${id}`);
    return response.data;
  },

  async updateSubscription(id: string, data: any): Promise<any> {
    const response = await api.put(`/admin/subscriptions/${id}`, data);
    return response.data;
  },

  async deleteSubscription(id: string): Promise<any> {
    const response = await api.delete(`/admin/subscriptions/${id}`);
    return response.data;
  },

  // Business Management (Admin-only)
  async getAllBusinesses(params?: any): Promise<any> {
    const response = await api.get('/admin/businesses', { params });
    return response.data;
  },

  async getBusinessById(id: string): Promise<any> {
    const response = await api.get(`/admin/businesses/${id}`);
    return response.data;
  },

  async updateBusiness(id: string, data: any): Promise<any> {
    const response = await api.put(`/admin/businesses/${id}`, data);
    return response.data;
  },

  async deleteBusiness(id: string): Promise<any> {
    const response = await api.delete(`/admin/businesses/${id}`);
    return response.data;
  },

  async suspendBusiness(id: string): Promise<any> {
    const response = await api.post(`/admin/businesses/${id}/suspend`);
    return response.data;
  },

  async activateBusiness(id: string): Promise<any> {
    const response = await api.post(`/admin/businesses/${id}/activate`);
    return response.data;
  },

  // System Logs Management
  async getSystemLogs(params?: any): Promise<any> {
    const response = await api.get('/admin/logs/system', { params });
    return response.data;
  },

  async getAuditLogs(params?: any): Promise<any> {
    const response = await api.get('/admin/logs/audit', { params });
    return response.data;
  },

  async getSecurityLogs(params?: any): Promise<any> {
    const response = await api.get('/admin/logs/security', { params });
    return response.data;
  },

  async getErrorLogs(params?: any): Promise<any> {
    const response = await api.get('/admin/logs/errors', { params });
    return response.data;
  },

  // User Management (Admin-only)
  async getAllSystemUsers(params?: any): Promise<any> {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async createSystemUser(data: any): Promise<any> {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  async updateSystemUser(id: string, data: any): Promise<any> {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  async deleteSystemUser(id: string): Promise<any> {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  async suspendUser(id: string): Promise<any> {
    const response = await api.post(`/admin/users/${id}/suspend`);
    return response.data;
  },

  async activateUser(id: string): Promise<any> {
    const response = await api.post(`/admin/users/${id}/activate`);
    return response.data;
  },

  // Platform Analytics
  async getPlatformAnalytics(params?: any): Promise<any> {
    const response = await api.get('/admin/analytics/platform', { params });
    return response.data;
  },

  async getRevenueAnalytics(params?: any): Promise<any> {
    const response = await api.get('/admin/analytics/revenue', { params });
    return response.data;
  },

  async getUserAnalytics(params?: any): Promise<any> {
    const response = await api.get('/admin/analytics/users', { params });
    return response.data;
  },

  // System Configuration
  async getSystemConfig(): Promise<any> {
    const response = await api.get('/admin/config/system');
    return response.data;
  },

  async updateSystemConfig(data: any): Promise<any> {
    const response = await api.put('/admin/config/system', data);
    return response.data;
  },

  // Feature Toggles
  async getFeatureToggles(): Promise<any> {
    const response = await api.get('/admin/config/features');
    return response.data;
  },

  async updateFeatureToggle(featureName: string, data: any): Promise<any> {
    const response = await api.put(`/admin/config/features/${featureName}`, data);
    return response.data;
  },

  // Backup and Maintenance
  async triggerBackup(data: any): Promise<any> {
    const response = await api.post('/admin/maintenance/backup', data);
    return response.data;
  },

  async getMaintenanceStatus(): Promise<any> {
    const response = await api.get('/admin/maintenance/status');
    return response.data;
  },

  async scheduleMaintenanceWindow(data: any): Promise<any> {
    const response = await api.post('/admin/maintenance/schedule', data);
    return response.data;
  }
};
