'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { User, UserRole, UserStatus } from '@/lib/types';
import { authService } from '@/lib/services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    // Only check auth status if we're not on login/register pages
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register') && !currentPath.startsWith('/auth')) {
        checkAuthStatus();
      } else {
        // On auth pages, just set loading to false without checking authentication
        setLoading(false);
      }
    }

    // Setup token refresh interval (every 5 minutes)
    refreshIntervalRef.current = setInterval(async () => {
      if (isAuthenticated) {
        await refreshUser();
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Refresh on window focus (e.g., tab switch)
    const handleFocus = () => {
      if (isAuthenticated) {
        refreshUser();
      }
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      window.removeEventListener('focus', handleFocus);
    };
  }, []); // Empty deps: runs once on mount

  const checkAuthStatus = async () => {
    try {
      const isAuth = await authService.checkAuthentication();
      if (isAuth) {
        const userData = authService.getCurrentUser();
        setUser(userData);
      } else {
        // Token invalid/expired - attempt refresh first
        await attemptTokenRefresh();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Don't auto-logout here; let the app handle via isAuthenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // New: Attempt to refresh token before full logout
  const attemptTokenRefresh = async () => {
    try {
      const refreshed = await authService.refreshToken(); // Assume authService has this method
      if (refreshed) {
        const userData = authService.getCurrentUser();
        setUser(userData);
        console.log('Token refreshed successfully');
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
    return false;
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      
      // Save user session after login (handles transformation)
      const userData = await authService.saveUserSession(response);
      setUser(userData);
      
      toast.success('Login successful!');
      
      // Redirect to user-specific dashboard based on userType
      const dashboardRoute = authService.getDashboardRoute();
      router.push(dashboardRoute);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const isAuth = await authService.checkAuthentication();
      if (isAuth) {
        const userData = authService.getCurrentUser();
        setUser(userData);
        console.log('User refreshed successfully');
      } else {
        // Try refresh before giving up
        const refreshed = await attemptTokenRefresh();
        if (!refreshed) {
          setUser(null);
          console.warn('Authentication expired - user cleared');
          // Optional: Auto-redirect to login after a delay
          setTimeout(() => {
            if (!isAuthenticated) {
              router.push('/login');
              toast.warning('Session expired. Please log in again.');
            }
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;