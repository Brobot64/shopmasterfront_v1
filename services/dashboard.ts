import { api } from './api';
import { businessService } from './business';
import { outletsService } from './outlets';
import { productsService } from './products';
import { usersService } from './users';
import { logsService } from './logs';

export interface DashboardMetrics {
  totalProducts: number;
  totalOutlets: number;
  totalUsers: number;
  lowStockProducts: number;
  recentActivities: any[];
  salesData?: any[];
  inventoryValue?: number;
}

export interface DashboardData {
  business: any;
  outlets: any[];
  products: any[];
  users: any[];
  logs: any[];
  metrics: DashboardMetrics;
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      // Fetch all data in parallel
      const [businessRes, outletsRes, productsRes, usersRes, logsRes] = await Promise.all([
        businessService.getBusinessByOwner().catch(() => ({ data: { business: null } })),
        outletsService.getOutletsByBusiness().catch(() => ({ data: { outlets: [] } })),
        productsService.getProducts().catch(() => ({ data: { products: [] } })),
        usersService.getUsers().catch(() => ({ data: { users: [] } })),
        logsService.getLogs().catch(() => ({ data: { logs: [] } }))
      ]);

      const business = businessRes.data.business;
      const outlets = outletsRes.data.outlets || [];
      const products = productsRes.data.products || [];
      const users = usersRes.data.users || [];
      const logs = logsRes.data.logs || [];

      // Calculate metrics
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
      throw error;
    }
  },

  async getMetrics(): Promise<DashboardMetrics> {
    const dashboardData = await this.getDashboardData();
    return dashboardData.metrics;
  }
};