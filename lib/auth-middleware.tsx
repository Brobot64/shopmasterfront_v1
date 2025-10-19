import React from 'react';
import { User } from '@/lib/types';

export type UserRole = 'admin' | 'owner' | 'store_executive' | 'sales_rep';

export interface AuthMiddlewareOptions {
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  redirectTo?: string;
  checkBusiness?: boolean;
  checkOutlet?: boolean;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NO_BUSINESS' | 'NO_OUTLET' = 'UNAUTHORIZED'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 4,
  owner: 3,
  store_executive: 2,
  sales_rep: 1,
};

export const checkUserPermission = (
  user: User | null,
  requiredRole: UserRole | UserRole[],
  options: {
    requireExactRole?: boolean;
    checkBusiness?: boolean;
    checkOutlet?: boolean;
    businessId?: string;
    outletId?: string;
  } = {}
): boolean => {
  if (!user) return false;

  const userRole = user.userType as UserRole;
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  // Check if user has any of the required roles
  const hasRequiredRole = options.requireExactRole
    ? requiredRoles.includes(userRole)
    : requiredRoles.some(role => ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[role]);

  if (!hasRequiredRole) return false;

  // Check business ownership/membership
  if (options.checkBusiness && options.businessId) {
    if (user.businessId !== options.businessId) {
      // Only admin can access other businesses
      return userRole === 'admin';
    }
  }

  // Check outlet access
  if (options.checkOutlet && options.outletId) {
    if (userRole === 'sales_rep' && user.outletId !== options.outletId) {
      return false; // Sales reps can only access their assigned outlet
    }
  }

  return true;
};

export const requireAuth = (user: User | null): void => {
  if (!user) {
    throw new AuthError('Authentication required', 'UNAUTHORIZED');
  }
};

export const requireRole = (
  user: User | null,
  requiredRole: UserRole | UserRole[],
  options?: {
    requireExactRole?: boolean;
    checkBusiness?: boolean;
    checkOutlet?: boolean;
    businessId?: string;
    outletId?: string;
  }
): void => {
  requireAuth(user);

  if (!checkUserPermission(user!, requiredRole, options)) {
    const roles = Array.isArray(requiredRole) ? requiredRole.join(', ') : requiredRole;
    throw new AuthError(
      `Insufficient permissions. Required role(s): ${roles}`,
      'FORBIDDEN'
    );
  }
};

export const requireBusiness = (user: User | null): void => {
  requireAuth(user);

  if (!user!.businessId) {
    throw new AuthError('Business association required', 'NO_BUSINESS');
  }
};

export const requireOutlet = (user: User | null): void => {
  requireAuth(user);

  if (!user!.outletId) {
    throw new AuthError('Outlet association required', 'NO_OUTLET');
  }
};

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: AuthMiddlewareOptions = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    try {
      if (options.requireAuth !== false) {
        requireAuth(user);
      }

      if (options.allowedRoles) {
        requireRole(user, options.allowedRoles);
      }

      if (options.checkBusiness) {
        requireBusiness(user);
      }

      if (options.checkOutlet) {
        requireOutlet(user);
      }

      return <Component {...props} />;
    } catch (error) {
      if (error instanceof AuthError) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive mb-4">
                {error.code === 'UNAUTHORIZED' && 'Authentication Required'}
                {error.code === 'FORBIDDEN' && 'Access Denied'}
                {error.code === 'NO_BUSINESS' && 'Business Required'}
                {error.code === 'NO_OUTLET' && 'Outlet Required'}
              </h1>
              <p className="text-muted-foreground mb-4">{error.message}</p>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Go to Login
              </button>
            </div>
          </div>
        );
      }
      throw error;
    }
  };
}

// Hook for checking permissions in components
export const usePermissions = () => {
  const { user } = useAuth();

  return {
    user,
    isAuthenticated: !!user,
    hasRole: (role: UserRole | UserRole[], options?: Parameters<typeof checkUserPermission>[2]) =>
      checkUserPermission(user, role, options),
    canManageUsers: () =>
      checkUserPermission(user, ['admin', 'owner', 'store_executive']),
    canManageProducts: () =>
      checkUserPermission(user, ['admin', 'owner', 'store_executive']),
    canManageInventory: () =>
      checkUserPermission(user, ['admin', 'owner', 'store_executive']),
    canViewSales: () =>
      checkUserPermission(user, ['admin', 'owner', 'store_executive', 'sales_rep']),
    canCreateSales: () =>
      checkUserPermission(user, ['admin', 'owner', 'store_executive', 'sales_rep']),
    canManageOutlets: () =>
      checkUserPermission(user, ['admin', 'owner']),
    canManageBusiness: () =>
      checkUserPermission(user, ['admin', 'owner']),
    isOwner: () => user?.userType === 'owner',
    isAdmin: () => user?.userType === 'admin',
    isStoreExecutive: () => user?.userType === 'store_executive',
    isSalesRep: () => user?.userType === 'sales_rep',
  };
};

// Import useAuth at the bottom to avoid circular dependency
import { useAuth } from '@/contexts/auth-context';
