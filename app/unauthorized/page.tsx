"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              You don't have permission to access this page.
            </p>
            {user && (
              <div className="text-sm space-y-1">
                <p>
                  User type: <span className="font-medium capitalize">{user.userType.replace('_', ' ')}</span>
                </p>
                <p>
                  Status: <span className="font-medium capitalize">{user.status}</span>
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button onClick={handleGoHome} className="w-full">
              Go to Dashboard
            </Button>
            <Button onClick={handleGoBack} variant="outline" className="w-full">
              Go Back
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="w-full">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}