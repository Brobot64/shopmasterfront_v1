import { apiClient } from '../api';
import { Inventory, CreateInventoryRequest, ApiResponse, PaginatedResponse } from '../types';
import { createErrorResponse, createErrorPaginatedResponse } from '../utils/api-response';

export interface InventoryFilters {
  productId?: string;
  outletId?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export class InventoryService {
  async getInventory(filters?: InventoryFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Inventory>> {
    try {
      const params = {
        ...filters,
        ...pagination
      };
      return await apiClient.get<PaginatedResponse<Inventory>>('/api/v1/inventories', { params });
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return createErrorPaginatedResponse<Inventory>('Failed to fetch inventory');
    }
  }

  async getInventoryById(id: string): Promise<ApiResponse<Inventory>> {
    try {
      return await apiClient.get<ApiResponse<Inventory>>(`/api/v1/inventories/${id}`);
    } catch (error) {
      console.error('Error fetching inventory by ID:', error);
      return createErrorResponse('Failed to fetch inventory', {} as Inventory);
    }
  }

  async createInventory(outletId: string, inventoryData: CreateInventoryRequest): Promise<ApiResponse<Inventory>> {
    try {
      return await apiClient.post<ApiResponse<Inventory>>(`/api/v1/outlets/${outletId}/inventories`, inventoryData);
    } catch (error) {
      console.error('Error creating inventory:', error);
      return createErrorResponse('Failed to create inventory', {} as Inventory);
    }
  }

  async reconcileInventory(id: string, inventoryData: Partial<CreateInventoryRequest>): Promise<ApiResponse<Inventory>> {
    try {
      return await apiClient.put<ApiResponse<Inventory>>(`/api/v1/inventories/${id}/reconcile`, inventoryData);
    } catch (error) {
      console.error('Error reconciling inventory:', error);
      return createErrorResponse('Failed to reconcile inventory', {} as Inventory);
    }
  }

  // Legacy methods with fallbacks for backward compatibility
  async updateInventory(id: string, inventoryData: Partial<CreateInventoryRequest>): Promise<ApiResponse<Inventory>> {
    return this.reconcileInventory(id, inventoryData);
  }

  async deleteInventory(id: string): Promise<ApiResponse<any>> {
    try {
      // Note: Delete endpoint not available in backend, returning error
      return { status: 'error', message: 'Delete inventory not supported' } as ApiResponse<any>;
    } catch (error) {
      console.error('Error deleting inventory:', error);
      return { status: 'error', message: 'Failed to delete inventory' } as ApiResponse<any>;
    }
  }

  async getInventoryByOutlet(outletId: string, filters?: Omit<InventoryFilters, 'outletId'>, pagination?: PaginationParams): Promise<PaginatedResponse<Inventory>> {
    try {
      const params = {
        ...filters,
        ...pagination,
        outletId
      };
      return await apiClient.get<PaginatedResponse<Inventory>>('/api/v1/inventories', { params });
    } catch (error) {
      console.error('Error fetching inventory by outlet:', error);
      return createErrorPaginatedResponse<Inventory>('Failed to fetch inventory');
    }
  }

  async createInventoryForOutlet(outletId: string, inventoryData: Omit<CreateInventoryRequest, 'outletId'>): Promise<ApiResponse<Inventory>> {
    return this.createInventory(outletId, inventoryData as CreateInventoryRequest);
  }

  // Additional utility methods with fallbacks
  async getInventoryByProduct(productId: string): Promise<ApiResponse<Inventory[]>> {
    try {
      const response = await this.getInventory({ productId });
      return { status: response.status, data: response.data || [], message: response.message };
    } catch (error) {
      console.error('Error fetching inventory by product:', error);
      return { status: 'error', data: [], message: 'Failed to fetch inventory' } as ApiResponse<Inventory[]>;
    }
  }

  async updateStock(id: string, quantity: number, type: 'add' | 'subtract' | 'set', reason?: string): Promise<ApiResponse<Inventory>> {
    try {
      // Using reconcile endpoint as stock update
      return await this.reconcileInventory(id, { quantity, reason } as any);
    } catch (error) {
      console.error('Error updating stock:', error);
      return { status: 'error', message: 'Failed to update stock' } as ApiResponse<Inventory>;
    }
  }

  async restockInventory(id: string, quantity: number, reason?: string): Promise<ApiResponse<Inventory>> {
    return this.updateStock(id, quantity, 'add', reason);
  }

  async adjustStock(id: string, newQuantity: number, reason?: string): Promise<ApiResponse<Inventory>> {
    return this.updateStock(id, newQuantity, 'set', reason);
  }

  async getLowStockItems(outletId?: string, threshold?: number): Promise<ApiResponse<Inventory[]>> {
    try {
      const response = await this.getInventory({ outletId, lowStock: true });
      return { status: response.status, data: response.data || [], message: response.message };
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      return { status: 'error', data: [], message: 'Failed to fetch low stock items' } as ApiResponse<Inventory[]>;
    }
  }

  async getOutOfStockItems(outletId?: string): Promise<ApiResponse<Inventory[]>> {
    try {
      const response = await this.getInventory({ outletId, outOfStock: true });
      return { status: response.status, data: response.data || [], message: response.message };
    } catch (error) {
      console.error('Error fetching out of stock items:', error);
      return { status: 'error', data: [], message: 'Failed to fetch out of stock items' } as ApiResponse<Inventory[]>;
    }
  }

  async getInventoryAlerts(outletId?: string): Promise<ApiResponse<{
    lowStock: Inventory[];
    outOfStock: Inventory[];
    reorderNeeded: Inventory[];
  }>> {
    try {
      const [lowStock, outOfStock] = await Promise.all([
        this.getLowStockItems(outletId),
        this.getOutOfStockItems(outletId)
      ]);
      
      return {
        status: 'success',
        data: {
          lowStock: lowStock.data || [],
          outOfStock: outOfStock.data || [],
          reorderNeeded: [] // Not implemented in backend
        }
      };
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
      return {
        status: 'error',
        data: { lowStock: [], outOfStock: [], reorderNeeded: [] },
        message: 'Failed to fetch inventory alerts'
      } as ApiResponse<any>;
    }
  }

  async getInventoryStats(outletId?: string): Promise<ApiResponse<{
    totalItems: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
    averageStockLevel: number;
    turnoverRate: number;
  }>> {
    try {
      const response = await this.getInventory({ outletId });
      const items = response.data || [];
      
      const stats = {
        totalItems: items.length,
        totalValue: items.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0),
        lowStockCount: items.filter(item => item.quantity <= (item.minStockLevel || 0)).length,
        outOfStockCount: items.filter(item => item.quantity === 0).length,
        averageStockLevel: items.length > 0 ? items.reduce((sum, item) => sum + item.quantity, 0) / items.length : 0,
        turnoverRate: 0 // Not calculated without sales data
      };
      
      return { status: 'success', data: stats };
    } catch (error) {
      console.error('Error calculating inventory stats:', error);
      return {
        status: 'error',
        data: { totalItems: 0, totalValue: 0, lowStockCount: 0, outOfStockCount: 0, averageStockLevel: 0, turnoverRate: 0 },
        message: 'Failed to calculate inventory stats'
      } as ApiResponse<any>;
    }
  }

  // Placeholder methods for features not implemented in backend
  async getInventoryMovements(inventoryId: string, pagination?: PaginationParams): Promise<PaginatedResponse<any>> {
    return {
      status: 'error',
      data: { items: [], total: 0, page: 1, limit: 10 },
      message: 'Inventory movements not implemented'
    } as PaginatedResponse<any>;
  }

  async bulkUpdateInventory(updates: any[]): Promise<ApiResponse<Inventory[]>> {
    return {
      status: 'error',
      data: [],
      message: 'Bulk update not implemented'
    } as ApiResponse<Inventory[]>;
  }

  async generateInventoryReport(filters?: any): Promise<ApiResponse<any>> {
    return {
      status: 'error',
      message: 'Inventory reports not implemented'
    } as ApiResponse<any>;
  }

  async getInventoryValuation(outletId?: string): Promise<ApiResponse<any>> {
    try {
      const stats = await this.getInventoryStats(outletId);
      return {
        status: stats.status,
        data: {
          totalValue: stats.data?.totalValue || 0,
          valueByCategory: {},
          topValueItems: []
        },
        message: stats.message
      };
    } catch (error) {
      console.error('Error calculating inventory valuation:', error);
      return {
        status: 'error',
        data: { totalValue: 0, valueByCategory: {}, topValueItems: [] },
        message: 'Failed to calculate inventory valuation'
      } as ApiResponse<any>;
    }
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;