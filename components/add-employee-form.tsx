// components/add-employee-form.tsx (fixed)
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usersService } from "@/services"
import { UserWithDetails, AddUserToStoreData, CreateUserData, UpdateUserData } from "@/services/users"
import { toast } from "@/lib/toast"
import { useAuth } from "@/contexts/auth-context"
import { ownerDashboardService } from "@/services"

interface AddEmployeeFormProps {
  user?: UserWithDetails
  onSuccess: () => void
}

export function AddEmployeeForm({ user, onSuccess }: AddEmployeeFormProps) {
  const { user: authUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [outlets, setOutlets] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "", // Only for new users
    userType: user?.userType || "store_executive",
    outletId: user?.outletId || "",
    status: user?.status || "active"
  })

  useEffect(() => {
    if (authUser?.businessId) {
      fetchOutlets()
    }
  }, [authUser?.businessId])

  const fetchOutlets = async () => {
    try {
      const response = await ownerDashboardService.getAllOutletsByBiz(authUser.businessId)
      setOutlets(response.data)
    } catch (error) {
      console.error("Error fetching outlets:", error)
      toast.error("Failed to load outlets")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (user) {
        // Update existing user
        const updateData: UpdateUserData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          userType: formData.userType as any,
          status: formData.status as any,
          outletId: formData.outletId || undefined
        }

        await usersService.updateUser(user.id, updateData)
        toast.success("Employee updated successfully")
      } else {
        // Create new user
        if (!authUser?.businessId) {
          toast.error("Business ID is required")
          return
        }

        const userData: CreateUserData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }

        const addUserData: AddUserToStoreData = {
          userData,
          userType: formData.userType,
          businessId: authUser.businessId,
          outletId: formData.outletId || undefined
        }

        await usersService.addUserToStore(addUserData)
        toast.success("Employee added successfully")
      }

      onSuccess()
    } catch (error: any) {
      console.error("Error saving employee:", error)
      toast.error(error.response?.data?.message || "Failed to save employee")
    } finally {
      setIsLoading(false)
    }
  }

  const isEditing = !!user
  const title = isEditing ? "Edit Employee" : "Add New Employee"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  placeholder="Enter a secure password"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="userType">Role</Label>
              <Select 
                value={formData.userType} 
                onValueChange={(value) => handleInputChange("userType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="store_executive">Store Executive</SelectItem>
                  <SelectItem value="sales_rep">Sales Representative</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {outlets.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="outletId">Outlet</Label>
                <Select 
                  value={formData.outletId || ""} 
                  onValueChange={(value) => handleInputChange("outletId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an outlet (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {outlets.map((outlet) => (
                      <SelectItem key={outlet.id} value={outlet.id}>
                        {outlet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (isEditing ? "Update Employee" : "Add Employee")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}