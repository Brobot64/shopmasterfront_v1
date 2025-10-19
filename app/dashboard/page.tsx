"use client";

import { useAuth } from "@/contexts/auth-context"
import { authService } from "@/lib/services/auth.service"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"

export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to user-specific dashboard once user is loaded
    if (!authLoading && user) {
      const dashboardRoute = authService.getDashboardRoute();
      if (dashboardRoute !== '/dashboard') {
        router.replace(dashboardRoute);
      }
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This is a fallback dashboard page - users should be redirected to their specific dashboards
  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="text-sm text-muted-foreground">
            Welcome back, {user?.firstName || 'User'}!
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <h3 className="text-lg font-semibold mb-2">Redirecting...</h3>
            <p className="text-muted-foreground text-center">
              You should be redirected to your user-specific dashboard.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              User Type: {user?.userType}
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
