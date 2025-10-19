import { api } from './api';

export interface Inventory {
  id: string;
  productId: string;
  outletId: string;
  quantity: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  lastRestocked?: string;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  outlet?: Outlet;
}

export interface CreateInventoryData {
  productId: string;
  outletId: string;
  quantity: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
}

export interface UpdateInventoryData {
  quantity?: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
}

export interface StockMovementData {
  productId: string;
  outletId: string;
  quantity: number;
  type: 'in' | 'out' | 'adjustment';
  reason?: string;
  reference?: string;
}

export interface InventoryResponse {
  status: string;
  data: {
    inventory: Inventory;
  };
}

export interface InventoriesResponse {
  status: string;
  data: {
    inventories: Inventory[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface LowStockResponse {
  status: string;
  data: {
    lowStockItems: Inventory[];
  };
}

export interface StockMovementResponse {
  status: string;
  message: string;
  data: {
    inventory: Inventory;
  };
}

export const inventoryService = {
  async createInventory(data: any): Promise<any> {
    const response = await api.post('/inventory', data);
    return response.data;
  },

  async getInventoryById(id: string): Promise<any> {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  async updateInventory(id: string, data: any): Promise<any> {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },

  async deleteInventory(id: string): Promise<any> {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  async getInventories(params?: any): Promise<any> {
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  async getInventoryByOutlet(outletId: string, params?: any): Promise<any> {
    const response = await api.get(`/inventory/outlet/${outletId}`, { params });
    return response.data;
  },

  async getLowStockItems(params?: any): Promise<any> {
    const response = await api.get('/inventory/low-stock', { params });
    return response.data;
  },

  async adjustStock(data: any): Promise<any> {
    const response = await api.post('/inventory/adjust', data);
    return response.data;
  },

  async stockIn(data: any): Promise<any> {
    const response = await api.post('/inventory/stock-in', data);
    return response.data;
  },

  async stockOut(data: any): Promise<any> {
    const response = await api.post('/inventory/stock-out', data);
    return response.data;
  },

  async getStockMovements(params?: any): Promise<any> {
    const response = await api.get('/inventory/movements', { params });
    return response.data;
  },

  async bulkUpdateInventory(data: any): Promise<any> {
    const response = await api.patch('/inventory/bulk-update', data);
    return response.data;
  },

  async getInventoryReport(params?: any): Promise<any> {
    const response = await api.get('/inventory/reports', { params });
    return response.data;
  },

  async getStockValuation(params?: any): Promise<any> {
    const response = await api.get('/inventory/valuation', { params });
    return response.data;
  },

  async generateReorderReport(params?: any): Promise<any> {
    const response = await api.get('/inventory/reorder-report', { params });
    return response.data;
  }
};
