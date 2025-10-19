// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  userType: string;
  status: UserStatus;
  businessId?: string;
  outletId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  STORE_EXECUTIVE = 'STORE_EXECUTIVE',
  SALES_REP = 'SALES_REP'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

// Business types
export interface Business {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  logo?: string;
  ownerId: string;
  subscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Outlet types
export interface Outlet {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  businessId: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  image?: string;
  status: ProductStatus;
  outletId: string;
  createdAt: string;
  updatedAt: string;
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED'
}

// Inventory types
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
}

// Sales types
export interface Sales {
  id: string;
  totalAmount: number;
  discount?: number;
  tax?: number;
  finalAmount: number;
  paymentChannel: PaymentChannel;
  status: SalesStatus;
  customerId?: string;
  salesRepId: string;
  outletId: string;
  createdAt: string;
  updatedAt: string;
  salesProducts?: SalesProduct[];
}

export interface SalesProduct {
  id: string;
  salesId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
}

export enum PaymentChannel {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  POS = 'POS',
  MOBILE_MONEY = 'MOBILE_MONEY'
}

export enum SalesStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// Dashboard types
export interface DashboardMetrics {
  totalProducts: number;
  totalOutlets: number;
  totalUsers: number;
  lowStockProducts: number;
  recentActivities: any[];
  inventoryValue?: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

// API Response types - Updated to match backend standards
export interface ApiResponse<T> {
  status: 'success' | 'error' | 'fail';
  data?: T;
  message?: string;
  error?: {
    statusCode: number;
    status: 'error' | 'fail';
    isOperational?: boolean;
  };
  stack?: string; // Only in development
}

export interface PaginatedResponse<T> {
  status: 'success' | 'error' | 'fail';
  data: T[];
  message?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    statusCode: number;
    status: 'error' | 'fail';
    isOperational?: boolean;
  };
}

// Auth types - Updated to match backend API responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: 'success';
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      userType: string;
      status: string;
      updatedAt: string;
      lastLogin: string;
      phone?: string | null;
      businessId: string;
      outletId?: string | null;
    };
    tokens: {
      accessToken: string;
      accessTokenExpiry: string;
    };
  };
}

export interface SignupRequest {
  userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  businessData: {
    name: string;
    category: string;
    address: string;
    yearOfEstablishment: number;
    contact: string;
    description: string;
  };
}

export interface SignupResponse {
  status: 'success';
  message: string;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      userType: string;
      status: string;
    };
    business: {
      id: string;
      name: string;
      status: string;
    };
  };
}

export interface OTPVerificationRequest {
  email: string;
  otp: string;
}

export interface OTPVerificationResponse {
  status: 'success';
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      userType: string;
      status: string;
    };
    tokens: {
      accessToken: string;
      accessTokenExpiry: string;
    };
  };
}

export interface MeResponse {
  status: 'success';
  data: {
    user: {
      id: string;
      email: string;
      userType: string;
      businessId: string;
      outletId?: string | null;
    };
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: UserRole;
}

// Form types
export interface CreateProductRequest {
  name: string;
  description?: string;
  category: string;
  price: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  image?: string;
  outletId: string;
}

export interface CreateSalesRequest {
  products: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  discount?: number;
  tax?: number;
  paymentChannel: PaymentChannel;
  customerId?: string;
  outletId: string;
}

export interface CreateInventoryRequest {
  productId: string;
  quantity: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  outletId: string;
}

export interface CreateEmployeeRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  businessId?: string;
  outletId?: string;
}