// API Client
export { api } from './api';

// Core Services
export { authService } from './auth';
export { businessService } from './business';
export { outletsService } from './outlets';
export { usersService } from './users';
export { productsService } from './products';
export { inventoryService } from './inventory';
export { salesService } from './sales';
export { logsService } from './logs';
export { dashboardService } from './dashboard';

// Role-based Dashboard Services
export { ownerDashboardService } from './owner-dashboard.service';
export { storeExecutiveDashboardService } from './store-executive-dashboard.service';
export { salesRepDashboardService } from './sales-rep-dashboard.service';
export { adminDashboardService } from './admin-dashboard.service';

// Admin Services
export { adminService } from './admin.service';

// Subscription Services
export { subscriptionService } from './subscription.service';

// Types (for backward compatibility)
export type { LoginCredentials, RegisterOwnerData, VerifySignupData, User, AuthResponse, MeResponse } from './auth';
export type { Business, BusinessResponse, UpdateBusinessData } from './business';
export type { Outlet, CreateOutletData, OutletsResponse, OutletResponse } from './outlets';
// export type { CreateUserData, UpdateUserData, UserWithDetails, UserResponse, UsersResponse } from './users';
export type { Product, CreateProductData, UpdateProductData, ProductResponse, ProductsResponse } from './products';
export type { Inventory, CreateInventoryData, UpdateInventoryData, StockMovementData, InventoryResponse, InventoriesResponse } from './inventory';
export type { Sales, SalesProduct, CreateSalesData, UpdateSalesData, SalesResponse, SalesListResponse } from './sales';
export { PaymentChannel, SalesStatus } from './sales';
export type { LogEntry, LogsResponse } from './logs';
export type { DashboardMetrics, DashboardData } from './dashboard';
