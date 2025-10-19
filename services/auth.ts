import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterOwnerData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  businessName: string;
  businessDescription?: string;
}

export interface VerifySignupData {
  email: string;
  otp: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'admin' | 'owner' | 'store_executive' | 'sales_rep';
  businessId: string;
  outletId: string | null;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
}

export interface MeResponse {
  status: string;
  data: {
    user: User;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async logout(): Promise<{ status: string; message: string }> {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async me(): Promise<MeResponse> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async registerOwner(data: RegisterOwnerData): Promise<{ status: string; message: string }> {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  async verifySignup(data: VerifySignupData): Promise<AuthResponse> {
    const response = await api.post('/auth/verify-signup', data);
    return response.data;
  },

  // Helper methods
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    // Since we're using cookie-based auth, we can't reliably check on client-side
    // The server will validate the cookie on each request
    return true; // Let the server handle validation
  },

  async getCurrentUser(): Promise<User> {
    const response = await this.me();
    return response.data.user;
  }
};
