"use client";

import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/lib/types";
import { ReactNode } from "react";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles; if false, user needs ANY role
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
  requireAll = false,
}: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  const userRole = user.role;
  const hasAccess = requireAll
    ? allowedRoles.includes(userRole) // In practice, users typically have one primary role
    : allowedRoles.includes(userRole);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

interface PermissionWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  allowOwner?: boolean;
  allowAdmin?: boolean;
  allowStoreExecutive?: boolean;
  allowSalesRep?: boolean;
}

export function PermissionWrapper({
  children,
  fallback = null,
  allowOwner = false,
  allowAdmin = false,
  allowStoreExecutive = false,
  allowSalesRep = false,
}: PermissionWrapperProps) {
  const allowedRoles: UserRole[] = [];
  
  if (allowAdmin) allowedRoles.push(UserRole.ADMIN);
  if (allowOwner) allowedRoles.push(UserRole.OWNER);
  if (allowStoreExecutive) allowedRoles.push(UserRole.STORE_EXECUTIVE);
  if (allowSalesRep) allowedRoles.push(UserRole.SALES_REP);

  return (
    <RoleGuard allowedRoles={allowedRoles} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

// Specific role components for common use cases
export function AdminOnly({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function OwnerOnly({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <RoleGuard allowedRoles={[UserRole.OWNER]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function ManagerLevel({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <RoleGuard 
      allowedRoles={[UserRole.ADMIN, UserRole.OWNER, UserRole.STORE_EXECUTIVE]} 
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}

export function StoreLevel({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <RoleGuard 
      allowedRoles={[UserRole.ADMIN, UserRole.OWNER, UserRole.STORE_EXECUTIVE, UserRole.SALES_REP]} 
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}

// Hook for permission checking in components
export function usePermissions() {
  const { user } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const canAccessAdminFeatures = (): boolean => {
    return hasRole(UserRole.ADMIN);
  };

  const canManageBusiness = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.OWNER]);
  };

  const canManageOutlets = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.OWNER]);
  };

  const canManageStore = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.OWNER, UserRole.STORE_EXECUTIVE]);
  };

  const canViewSales = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.OWNER, UserRole.STORE_EXECUTIVE, UserRole.SALES_REP]);
  };

  const canCreateSales = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.OWNER, UserRole.STORE_EXECUTIVE, UserRole.SALES_REP]);
  };

  const canManageProducts = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.OWNER, UserRole.STORE_EXECUTIVE]);
  };

  const canManageInventory = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.OWNER, UserRole.STORE_EXECUTIVE, UserRole.SALES_REP]);
  };

  const canCreateUsers = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.OWNER, UserRole.STORE_EXECUTIVE]);
  };

  const canViewReports = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.OWNER, UserRole.STORE_EXECUTIVE]);
  };

  const canViewDashboard = (dashboardType: 'admin' | 'owner' | 'store-executive' | 'sales-rep'): boolean => {
    switch (dashboardType) {
      case 'admin':
        return hasRole(UserRole.ADMIN);
      case 'owner':
        return hasAnyRole([UserRole.ADMIN, UserRole.OWNER]);
      case 'store-executive':
        return hasAnyRole([UserRole.ADMIN, UserRole.OWNER, UserRole.STORE_EXECUTIVE]);
      case 'sales-rep':
        return hasAnyRole([UserRole.ADMIN, UserRole.OWNER, UserRole.STORE_EXECUTIVE, UserRole.SALES_REP]);
      default:
        return false;
    }
  };

  return {
    user,
    hasRole,
    hasAnyRole,
    canAccessAdminFeatures,
    canManageBusiness,
    canManageOutlets,
    canManageStore,
    canViewSales,
    canCreateSales,
    canManageProducts,
    canManageInventory,
    canCreateUsers,
    canViewReports,
    canViewDashboard,
  };
}
