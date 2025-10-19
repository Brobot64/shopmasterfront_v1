// Export all services
export { authService, AuthService } from './auth.service';
export { dashboardService, DashboardService } from './dashboard.service';
export { productsService, ProductsService } from './products.service';
export { salesService, SalesService } from './sales.service';
export { inventoryService, InventoryService } from './inventory.service';
export { employeesService, EmployeesService } from './employees.service';
export { businessService, BusinessService } from './business.service';
export { outletsService, OutletsService } from './outlets.service';
export { usersService, UsersService } from './users.service';
export { logsService, LogsService } from './logs.service';
export { uploadService, UploadService } from './upload.service';

// Export service types
export type { CreateProductData, UpdateProductData, ProductWithDetails } from './products.service';
export type { UpdateBusinessData } from './business.service';
export type { CreateOutletData, OutletWithDetails } from './outlets.service';
export type { CreateUserData, UpdateUserData, UserWithDetails } from './users.service';
export type { SalesFilters, PaginationParams as SalesPaginationParams } from './sales.service';
export type { InventoryFilters, PaginationParams as InventoryPaginationParams } from './inventory.service';
export type { EmployeeFilters, PaginationParams as EmployeesPaginationParams } from './employees.service';
export type { UploadResponse, UploadProgressCallback } from './upload.service';
