import { api } from "./api";

export const ownerDashboardService = {
	// Dashboard Service - Updated to match your backend routes
	async getOwnerTotalSales(params?: any): Promise<any> {
		const response = await api.get("/dashboard/owner/sales/total", { params });
		return response.data;
	},

	async getOwnerTotalAmountMade(params?: any): Promise<any> {
		const response = await api.get("/dashboard/owner/amount/total", { params });
		return response.data;
	},

	async getOwnerTotalAvailableProductsWorth(params?: any): Promise<any> {
		const response = await api.get("/dashboard/owner/products/available", {
			params,
		});
		return response.data;
	},

	async getOwnerSalesAcrossOutletsOverTime(params?: any): Promise<any> {
		const response = await api.get("/dashboard/owner/sales/outlets-over-time", {
			params,
		});
		return response.data;
	},

	async getOwnerTopSoldProductCategories(params?: any): Promise<any> {
		const response = await api.get("/dashboard/owner/products/top-categories", {
			params,
		});
		return response.data;
	},

	async getOwnerTopPerformingOutlets(params?: any): Promise<any> {
		const response = await api.get("/dashboard/owner/outlets/top-performing", {
			params,
		});
		return response.data;
	},

	async getOwnerRecentLogs(params?: any): Promise<any> {
		const response = await api.get("/dashboard/owner/logs/recent", { params });
		return response.data;
	},

	// You can keep these as convenience methods that combine multiple endpoints
	async getBusinessOverview(params?: any): Promise<any> {
		// This would combine data from multiple endpoints
		const [totalSales, totalAmount, productsWorth] = await Promise.all([
			this.getOwnerTotalSales(params),
			this.getOwnerTotalAmountMade(params),
			this.getOwnerTotalAvailableProductsWorth(params),
		]);

		return {
			totalSales: totalSales.data,
			totalAmount: totalAmount.data,
			productsWorth: productsWorth.data,
		};
	},

	async getSalesPerformance(params?: any): Promise<any> {
		// This might combine sales over time with top categories
		const [salesOverTime, topCategories] = await Promise.all([
			this.getOwnerSalesAcrossOutletsOverTime(params),
			this.getOwnerTopSoldProductCategories(params),
		]);

		return {
			salesOverTime: salesOverTime.data,
			topCategories: topCategories.data,
		};
	},

	async getRevenueAnalytics(params?: any): Promise<any> {
		// Focus on revenue-related data
		const [totalAmount, salesOverTime] = await Promise.all([
			this.getOwnerTotalAmountMade(params),
			this.getOwnerSalesAcrossOutletsOverTime(params),
		]);

		return {
			totalRevenue: totalAmount.data,
			revenueTrend: salesOverTime.data,
		};
	},

	async getOutletPerformance(params?: any): Promise<any> {
		// Focus on outlet performance data
		const [topOutlets, outletSalesOverTime] = await Promise.all([
			this.getOwnerTopPerformingOutlets(params),
			this.getOwnerSalesAcrossOutletsOverTime(params),
		]);

		return {
			topOutlets: topOutlets.data,
			outletSalesTrend: outletSalesOverTime.data,
		};
	},

  async getOverAllOwnerData(params?: any): Promise<any> {
    const [totalSales, totalAmount, productsWorth, topOutlets, topCategories, recentLogs] = await Promise.all([
      this.getOwnerTotalSales(params),
      this.getOwnerTotalAmountMade(params),
      this.getOwnerTotalAvailableProductsWorth(params),
      this.getOwnerTopPerformingOutlets(params),
      this.getOwnerTopSoldProductCategories(params),
      this.getOwnerRecentLogs(params),
    ]);

    return {
      totalSales: totalSales.data,
      totalAmount: totalAmount.data,
      productsWorth: productsWorth.data,
      topOutlets: topOutlets.data,
      topCategories: topCategories.data,
      recentLogs: recentLogs.data,
    };
  },
// outlets/businesses/2ffd7669-7edd-4921-bad5-9fadfd9a50fd
  async getAllOutletsByBiz(businessId: string): Promise<any> {
		const response = await api.get(`/outlets/businesses/${businessId}`);
		return response.data;
	},

};
