import { apiClient } from '../api';
import { 
  LoginRequest, 
  LoginResponse, 
  SignupRequest, 
  SignupResponse, 
  OTPVerificationRequest, 
  OTPVerificationResponse, 
  MeResponse,
  RegisterRequest, 
  ApiResponse, 
  User, 
  UserRole, 
  UserStatus 
} from '../types';

// Session storage keys
const USER_SESSION_KEY = 'shopmaster_user';
const TOKEN_EXPIRY_KEY = 'shopmaster_token_expiry';

// Helper function to create error response
function createErrorResponse<T>(message: string, data: T): ApiResponse<T> {
  return {
    status: 'error',
    message,
    data
  };
}

// Utility function to transform backend user data to frontend User interface
function transformBackendUser(backendUser: any): User {
  // Map userType to role enum (handle lowercase from backend)
  let role: UserRole;
  switch (backendUser.userType.toLowerCase()) {
    case 'admin':
      role = UserRole.ADMIN;
      break;
    case 'owner':
      role = UserRole.OWNER;
      break;
    case 'store_executive':
    case 'store-executive':
      role = UserRole.STORE_EXECUTIVE;
      break;
    case 'sales_rep':
    case 'sales-rep':
      role = UserRole.SALES_REP;
      break;
    default:
      role = UserRole.OWNER; // Default fallback
  }
  
  // Map status string to enum (handle lowercase from backend)
  let status: UserStatus;
  switch ((backendUser.status || 'active').toLowerCase()) {
    case 'active':
      status = UserStatus.ACTIVE;
      break;
    case 'inactive':
      status = UserStatus.INACTIVE;
      break;
    case 'suspended':
      status = UserStatus.SUSPENDED;
      break;
    default:
      status = UserStatus.ACTIVE; // Default fallback
  }
  
  return {
    id: backendUser.id,
    email: backendUser.email,
    firstName: backendUser.firstName || '',
    lastName: backendUser.lastName || '',
    phoneNumber: backendUser.phone || undefined,
    userType: backendUser.userType, // Keep original lowercase value
    role: role,
    status: status,
    businessId: backendUser.businessId || undefined,
    outletId: backendUser.outletId || undefined,
    createdAt: backendUser.updatedAt || new Date().toISOString(),
    updatedAt: backendUser.updatedAt || new Date().toISOString()
  };
}

export class AuthService {
  // Session storage management
  private saveUserToSession(user: User): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    }
  }

  private getUserFromSession(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = sessionStorage.getItem(USER_SESSION_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing user from session:', error);
          this.clearUserSession();
        }
      }
    }
    return null;
  }

  private clearUserSession(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(USER_SESSION_KEY);
      sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
  }

  private saveTokenExpiry(expiry: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiry);
    }
  }

  private isTokenExpired(): boolean {
    if (typeof window !== 'undefined') {
      const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
      if (expiry) {
        return new Date() >= new Date(expiry);
      }
    }
    return true; // If no expiry found, assume expired
  }

  // Method to get transformed user data from login/verification response
  async getTransformedUserFromResponse(response: LoginResponse | OTPVerificationResponse): Promise<User> {
    const userData = response.data.user;
    return transformBackendUser(userData);
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(signupData: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await apiClient.post<SignupResponse>('/auth/signup', signupData);
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async verifySignup(verificationData: OTPVerificationRequest): Promise<OTPVerificationResponse> {
    try {
      const response = await apiClient.post<OTPVerificationResponse>('/auth/verify-signup', verificationData);
      return response;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  // Legacy register method - keeping for backward compatibility
  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    try {
      return await apiClient.post<ApiResponse<User>>('/auth/register-owner', userData);
    } catch (error) {
      console.error('Registration error:', error);
      return createErrorResponse('Failed to register user', {} as User);
    }
  }

  // Save user data after successful login
  async saveUserSession(loginResponse: LoginResponse): Promise<User> {
    const transformedUser = await this.getTransformedUserFromResponse(loginResponse);
    this.saveUserToSession(transformedUser);
    this.saveTokenExpiry(loginResponse.data.tokens.accessTokenExpiry);
    return transformedUser;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear session
      console.error('Logout error:', error);
    } finally {
      this.clearUserSession();
      this.clearLocalData();
    }
  }

  // Get user from session storage (primary method)
  getCurrentUser(): User | null {
    return this.getUserFromSession();
  }

  // Check if session is still valid by calling /me endpoint
  async validateSession(): Promise<boolean> {
    try {
      // First check if we have a user in session
      const sessionUser = this.getUserFromSession();
      if (!sessionUser) {
        return false;
      }

      // Check if token is expired
      if (this.isTokenExpired()) {
        this.clearUserSession();
        return false;
      }

      // Validate with server - /me endpoint is only for checking if session is still active
      const response = await apiClient.get<MeResponse>('/auth/me');
      return response.status === 'success';
    } catch (error) {
      console.error('Session validation error:', error);
      this.clearUserSession();
      return false;
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post<ApiResponse<any>>('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      return createErrorResponse('Failed to send password reset email', null);
    }
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post<ApiResponse<any>>('/auth/reset-password', { token, password });
    } catch (error) {
      console.error('Reset password error:', error);
      return createErrorResponse('Failed to reset password', null);
    }
  }

  async verifyEmail(token: string): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post<ApiResponse<any>>('/auth/verify-email', { token });
    } catch (error) {
      console.error('Email verification error:', error);
      return createErrorResponse('Failed to verify email', null);
    }
  }

  async resendVerificationEmail(email: string): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post<ApiResponse<any>>('/auth/resend-verification', { email });
    } catch (error) {
      console.error('Resend verification error:', error);
      return createErrorResponse('Failed to resend verification email', null);
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    try {
      return await apiClient.post<LoginResponse>('/auth/refresh');
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post<ApiResponse<any>>('/api/v1/auth/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Change password error:', error);
      return createErrorResponse('Failed to change password', null);
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      return await apiClient.put<ApiResponse<User>>('/auth/profile', profileData);
    } catch (error) {
      console.error('Update profile error:', error);
      return createErrorResponse('Failed to update profile', {} as User);
    }
  }

  private clearLocalData(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return user !== null && !this.isTokenExpired();
  }

  async checkAuthentication(): Promise<boolean> {
    // First check session
    if (!this.isAuthenticated()) {
      return false;
    }
    
    // Validate with server
    return await this.validateSession();
  }


  // Utility method to check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.userType.toLowerCase() === role.toLowerCase();
  }

  // Utility method to check if user is owner
  isOwner(): boolean {
    return this.hasRole('owner');
  }

  // Utility method to check if user is store executive
  isStoreExecutive(): boolean {
    return this.hasRole('store_executive');
  }

  // Utility method to check if user is sales rep
  isSalesRep(): boolean {
    return this.hasRole('sales_rep');
  }

  // Get dashboard route based on user type
  getDashboardRoute(): string {
    const user = this.getCurrentUser();
    if (!user) return '/login';
    
    switch (user.userType.toLowerCase()) {
      case 'admin':
        return '/dashboard/admin';
      case 'owner':
        return '/dashboard/owner';
      case 'store_executive':
        return '/dashboard/store-executive';
      case 'sales_rep':
        return '/dashboard/sales-rep';
      default:
        return '/dashboard';
    }
  }

  // Transform /me endpoint response to User interface for session validation
  private transformMeResponseToUser(meUser: MeResponse['data']['user'], existingUser?: User): User {
    // Map userType to role enum (handle lowercase from backend)
    let role: UserRole;
    switch (meUser.userType.toLowerCase()) {
      case 'admin':
        role = UserRole.ADMIN;
        break;
      case 'owner':
        role = UserRole.OWNER;
        break;
      case 'store_executive':
      case 'store-executive':
        role = UserRole.STORE_EXECUTIVE;
        break;
      case 'sales_rep':
      case 'sales-rep':
        role = UserRole.SALES_REP;
        break;
      default:
        role = UserRole.OWNER; // Default fallback
    }

    return {
      id: meUser.id,
      email: meUser.email,
      firstName: existingUser?.firstName || '',
      lastName: existingUser?.lastName || '',
      phoneNumber: existingUser?.phoneNumber || undefined,
      userType: meUser.userType, // Keep original value from backend
      role: role,
      status: existingUser?.status || UserStatus.ACTIVE,
      businessId: meUser.businessId || undefined,
      outletId: meUser.outletId || undefined,
      createdAt: existingUser?.createdAt || new Date().toISOString(),
      updatedAt: existingUser?.updatedAt || new Date().toISOString()
    };
  }
}

export const authService = new AuthService();
export default authService;