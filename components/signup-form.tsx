"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { authService } from "@/lib/services"
import { SignupRequest } from "@/lib/types"
import { useState } from "react"
import { toast } from "sonner"

interface SignupFormProps {
  onSignupSuccess: (email: string) => void;
  onSwitchToLogin?: () => void;
  className?: string;
}

export function SignupForm({
  onSignupSuccess,
  onSwitchToLogin,
  className,
  ...props
}: SignupFormProps & React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // User Data
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    // Business Data
    businessName: "",
    businessCategory: "",
    businessAddress: "",
    businessContact: "",
    businessDescription: "",
    yearOfEstablishment: new Date().getFullYear()
  });

  const businessCategories = [
    "retail",
    "grocery",
    "pharmacy",
    "electronics",
    "clothing",
    "food_beverage",
    "automotive",
    "beauty_personal_care",
    "home_garden",
    "sports_recreation",
    "books_media",
    "other"
  ];

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword, phone, businessName, businessCategory, businessAddress, businessContact } = formData;

    if (!firstName?.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName?.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!email?.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!phone?.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!businessName?.trim()) {
      toast.error("Business name is required");
      return false;
    }
    if (!businessCategory) {
      toast.error("Business category is required");
      return false;
    }
    if (!businessAddress?.trim()) {
      toast.error("Business address is required");
      return false;
    }
    if (!businessContact?.trim()) {
      toast.error("Business contact is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const signupData: SignupRequest = {
        userData: {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        },
        businessData: {
          name: formData.businessName,
          category: formData.businessCategory,
          address: formData.businessAddress,
          contact: formData.businessContact,
          description: formData.businessDescription || "Business description",
          yearOfEstablishment: formData.yearOfEstablishment
        }
      };

      const response = await authService.signup(signupData);
      
      if (response.status === 'success') {
        toast.success(response.message || "Registration successful! Please check your email for verification code.");
        onSignupSuccess(formData.email);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 lg:grid-cols-3">
          <form className="p-6 md:p-8 lg:col-span-2" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create Your Account</h1>
                <p className="text-muted-foreground text-balance">
                  Join ShopMaster and start managing your business today
                </p>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange("firstName")}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange("lastName")}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={handleInputChange("phone")}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange("password")}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange("confirmPassword")}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Business Information</h3>
                
                <div className="grid gap-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange("businessName")}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="businessCategory">Business Category *</Label>
                  <Select 
                    value={formData.businessCategory} 
                    onValueChange={handleSelectChange("businessCategory")}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business category" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Textarea
                    id="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange("businessAddress")}
                    required
                    disabled={loading}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="businessContact">Business Contact *</Label>
                    <Input
                      id="businessContact"
                      placeholder="contact@business.com"
                      value={formData.businessContact}
                      onChange={handleInputChange("businessContact")}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="yearOfEstablishment">Year Established</Label>
                    <Input
                      id="yearOfEstablishment"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.yearOfEstablishment}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        yearOfEstablishment: parseInt(e.target.value) || new Date().getFullYear()
                      }))}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="Tell us about your business..."
                    value={formData.businessDescription}
                    onChange={handleInputChange("businessDescription")}
                    disabled={loading}
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                {onSwitchToLogin ? (
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="underline underline-offset-4 hover:text-primary"
                    disabled={loading}
                  >
                    Sign in
                  </button>
                ) : (
                  <a href="/login" className="underline underline-offset-4 hover:text-primary">
                    Sign in
                  </a>
                )}
              </div>
            </div>
          </form>
          
          <div className="bg-muted relative hidden lg:block">
            <img
              src="https://picsum.photos/4000/4000"
              alt="Registration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By creating an account, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
