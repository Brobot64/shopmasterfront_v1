import { api } from './api';
import { Outlet } from './outlets';
import { Product } from './products';
import { User } from './users';

export interface SalesProduct {
  id?: string;
  salesId?: string;
  productId: string;
  productName: string;
  quantity: number;
  priceAtSale: string | number;
  product?: Product;
}

export interface Sales {
  id: string;
  totalAmount: string | number;
  discount: string | number;
  status: SalesStatus;
  remainingToPay: string | number;
  amountPaid: string | number;
  paymentChannel: PaymentChannel;
  customer?: any; // null or customer object
  customerName?: string;
  customerPhone?: string;
  salesPersonId: string;
  outletId: string;
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  products?: SalesProduct[];
  salesPerson?: User;
  outlet?: Outlet;
}

export enum PaymentChannel {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
  POS = 'pos',
  MOBILE_MONEY = 'mobile_money'
}

export enum SalesStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface CreateSalesData {
  products: Array<{
    productId: string;
    quantity: number;
    priceAtSale: number;
  }>;
  discount?: number;
  amountPaid?: number;
  paymentChannel: PaymentChannel;
  customerName?: string;
  customerPhone?: string;
  outletId: string;
  notes?: string;
}

export interface UpdateSalesData {
  discount?: number;
  amountPaid?: number;
  paymentChannel?: PaymentChannel;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  status?: SalesStatus;
}

export interface SalesResponse {
  status: string;
  data: {
    sale: Sales;
  };
}

export interface SalesListResponse {
  status: string;
  data: Sales[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export const salesService = {
  async createSale(data: CreateSalesData): Promise<SalesResponse> {
    const response = await api.post('/sales', data);
    return response.data;
  },

  async getSaleById(id: string): Promise<SalesResponse> {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  async updateSale(id: string, data: UpdateSalesData): Promise<SalesResponse> {
    const response = await api.put(`/sales/${id}`, data);
    return response.data;
  },

  async deleteSale(id: string): Promise<any> {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  },

  async getSales(params?: any): Promise<SalesListResponse> {
    const response = await api.get('/sales', { params });
    return response.data;
  },

  async getSalesByOutlet(outletId: string, params?: any): Promise<SalesListResponse> {
    const response = await api.get(`/outlets/${outletId}/sales`, { params });
    return response.data;
  },

  async getSalesByRep(salesRepId: string, params?: any): Promise<SalesListResponse> {
    const response = await api.get(`/sales/rep/${salesRepId}`, { params });
    return response.data;
  },

  async completeSale(id: string): Promise<SalesResponse> {
    const response = await api.post(`/sales/${id}/complete`);
    return response.data;
  },

  async cancelSale(id: string, reason?: string): Promise<SalesResponse> {
    const response = await api.post(`/sales/${id}/cancel`, { reason });
    return response.data;
  },

  async refundSale(id: string, reason?: string, amount?: number): Promise<SalesResponse> {
    const response = await api.post(`/sales/${id}/refund`, { reason, amount });
    return response.data;
  },

  async printReceipt(id: string): Promise<any> {
    const response = await api.get(`/sales/${id}/receipt`);
    return response.data;
  },
};