import { api } from './api';

export const subscriptionService = {
  // Get current subscription
  async getCurrentSubscription(): Promise<any> {
    const response = await api.get('/subscription');
    return response.data;
  },

  // Get subscription by ID
  async getSubscriptionById(id: string): Promise<any> {
    const response = await api.get(`/subscription/${id}`);
    return response.data;
  },

  // Update subscription
  async updateSubscription(id: string, data: any): Promise<any> {
    const response = await api.put(`/subscription/${id}`, data);
    return response.data;
  },

  // Cancel subscription
  async cancelSubscription(id: string, data?: any): Promise<any> {
    const response = await api.post(`/subscription/${id}/cancel`, data);
    return response.data;
  },

  // Renew subscription
  async renewSubscription(id: string, data?: any): Promise<any> {
    const response = await api.post(`/subscription/${id}/renew`, data);
    return response.data;
  },

  // Upgrade subscription
  async upgradeSubscription(id: string, data: any): Promise<any> {
    const response = await api.post(`/subscription/${id}/upgrade`, data);
    return response.data;
  },

  // Downgrade subscription
  async downgradeSubscription(id: string, data: any): Promise<any> {
    const response = await api.post(`/subscription/${id}/downgrade`, data);
    return response.data;
  },

  // Get subscription plans
  async getSubscriptionPlans(): Promise<any> {
    const response = await api.get('/subscription/plans');
    return response.data;
  },

  // Get subscription history
  async getSubscriptionHistory(params?: any): Promise<any> {
    const response = await api.get('/subscription/history', { params });
    return response.data;
  },

  // Get billing information
  async getBillingInfo(): Promise<any> {
    const response = await api.get('/subscription/billing');
    return response.data;
  },

  // Update billing information
  async updateBillingInfo(data: any): Promise<any> {
    const response = await api.put('/subscription/billing', data);
    return response.data;
  },

  // Get invoices
  async getInvoices(params?: any): Promise<any> {
    const response = await api.get('/subscription/invoices', { params });
    return response.data;
  },

  // Download invoice
  async downloadInvoice(invoiceId: string): Promise<any> {
    const response = await api.get(`/subscription/invoices/${invoiceId}/download`);
    return response.data;
  },

  // Process payment
  async processPayment(data: any): Promise<any> {
    const response = await api.post('/subscription/payment', data);
    return response.data;
  },

  // Get payment methods
  async getPaymentMethods(): Promise<any> {
    const response = await api.get('/subscription/payment-methods');
    return response.data;
  },

  // Add payment method
  async addPaymentMethod(data: any): Promise<any> {
    const response = await api.post('/subscription/payment-methods', data);
    return response.data;
  },

  // Update payment method
  async updatePaymentMethod(id: string, data: any): Promise<any> {
    const response = await api.put(`/subscription/payment-methods/${id}`, data);
    return response.data;
  },

  // Delete payment method
  async deletePaymentMethod(id: string): Promise<any> {
    const response = await api.delete(`/subscription/payment-methods/${id}`);
    return response.data;
  },

  // Set default payment method
  async setDefaultPaymentMethod(id: string): Promise<any> {
    const response = await api.post(`/subscription/payment-methods/${id}/default`);
    return response.data;
  }
};
