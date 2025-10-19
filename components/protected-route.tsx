"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  requiredUserType?: string[];
  allowedUserTypes?: string[]; // New prop for clearer naming
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredUserType, 
  allowedUserTypes 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Check role-based access (legacy support)
      if (requiredRole && !requiredRole.map(r => r.toLowerCase()).includes(user.userType.toLowerCase())) {
        router.push("/unauthorized");
        return;
      }
      
      // Check userType-based access (legacy support)
      if (requiredUserType && !requiredUserType.map(r => r.toLowerCase()).includes(user.userType.toLowerCase())) {
        router.push("/unauthorized");
        return;
      }
      
      // Check allowedUserTypes (new preferred prop)
      if (allowedUserTypes && !allowedUserTypes.map(r => r.toLowerCase()).includes(user.userType.toLowerCase())) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [user, requiredRole, requiredUserType, allowedUserTypes, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <p className="text-muted-foreground">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check access permissions
  const hasAccess = () => {
    if (!user) return false;
    
    if (requiredRole && !requiredRole.map(r => r.toLowerCase()).includes(user.userType.toLowerCase())) {
      return false;
    }
    
    if (requiredUserType && !requiredUserType.map(r => r.toLowerCase()).includes(user.userType.toLowerCase())) {
      return false;
    }
    
    if (allowedUserTypes && !allowedUserTypes.map(r => r.toLowerCase()).includes(user.userType.toLowerCase())) {
      return false;
    }
    
    return true;
  };

  if (user && !hasAccess()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground text-center">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Required access: {allowedUserTypes?.join(', ') || requiredUserType?.join(', ') || requiredRole?.join(', ')}
            </p>
            <p className="text-sm text-muted-foreground">
              Your access level: {user.userType}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}