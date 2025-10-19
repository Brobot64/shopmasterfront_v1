"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/lib/services"
import { useState } from "react"
import { toast } from "sonner"

interface OTPVerificationFormProps {
  email: string;
  onVerificationSuccess: () => void;
  onBack?: () => void;
  className?: string;
}

export function OTPVerificationForm({
  email,
  onVerificationSuccess,
  onBack,
  className,
  ...props
}: OTPVerificationFormProps & React.ComponentProps<"div">) {
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.verifySignup({ email, otp });
      
      if (response.status === 'success') {
        toast.success("Email verified successfully!");
        onVerificationSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResending(true);
      await authService.resendVerificationEmail(email);
      toast.success("OTP has been resent to your email");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOTP(value);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Verify Your Email</h1>
                <p className="text-muted-foreground text-balance">
                  We've sent a 6-digit verification code to<br />
                  <span className="font-medium">{email}</span>
                </p>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={handleOTPChange}
                  required
                  disabled={loading}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                  {loading ? "Verifying..." : "Verify Email"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOTP}
                  disabled={resending || loading}
                  className="w-full"
                >
                  {resending ? "Resending..." : "Resend Code"}
                </Button>

                {onBack && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onBack}
                    disabled={loading}
                    className="w-full"
                  >
                    Back to Registration
                  </Button>
                )}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Didn't receive the code? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending || loading}
                  className="underline underline-offset-4 hover:text-primary disabled:opacity-50"
                >
                  resend it
                </button>
              </div>
            </div>
          </form>
          
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://picsum.photos/4000/4000"
              alt="Verification"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
