"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Save, X } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { usersService } from "@/services"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { ownerDashboardService } from "@/services"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  userType: string
  status: string
  lastLogin?: string
  createdAt: string
  updatedAt: string
  business?: {
    id: string
    name: string
  }
  outlet?: {
    id: string
    name: string
  }
  businessId?: string
  outletId?: string
}

interface Outlet {
  id: string
  name: string
}

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [employee, setEmployee] = useState<User | null>(null)
  const [editedEmployee, setEditedEmployee] = useState<Partial<User>>({})
  const [outlets, setOutlets] = useState<Outlet[]>([])

  const employeeId = params.id as string

  useEffect(() => {
    fetchEmployee()
    if (user?.businessId) {
      fetchOutlets()
    }
  }, [employeeId, user?.businessId])

  const fetchEmployee = async () => {
    try {
      setIsLoading(true)
      const response = await usersService.getUserById(employeeId)
      const fetchedUser = response.data.user // Adjusted based on sample response
      // @ts-ignore
      setEmployee(fetchedUser)
      setEditedEmployee(fetchedUser)
    } catch (error) {
      console.error("Error fetching employee:", error)
      toast.error("Failed to load employee details")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOutlets = async () => {
    try {
      const response = await ownerDashboardService.getAllOutletsByBiz(user.businessId)
      setOutlets(response.data) // Assuming response.data is array of outlets
    } catch (error) {
      console.error("Error fetching outlets:", error)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // @ts-ignore
      await usersService.updateUser(employeeId, editedEmployee)
      setEmployee(editedEmployee as User)
      setIsEditing(false)
      toast.success("Employee updated successfully")
      fetchEmployee() // Refresh from server
    } catch (error) {
      console.error("Error updating employee:", error)
      toast.error("Failed to update employee")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedEmployee(employee || {})
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof User, value: any) => {
    setEditedEmployee(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-extrabold tracking-tight">Employee Not Found</h1>
        </div>
        <p className="text-muted-foreground">The employee you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {isEditing ? "Edit Employee" : "Employee Details"}
            </h1>
          </div>
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>.</span>
            <span>Employees</span>
            <span>.</span>
            <span className="text-foreground font-semibold">{employee.firstName} {employee.lastName}</span>
          </nav>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Employee
            </Button>
          )}
        </div>
      </div>

      {/* Employee Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-bold text-foreground uppercase tracking-wide">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={editedEmployee.firstName || ""}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-lg font-semibold">{employee.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-bold text-foreground uppercase tracking-wide">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={editedEmployee.lastName || ""}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-lg font-semibold">{employee.lastName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-bold text-foreground uppercase tracking-wide">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedEmployee.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-lg font-semibold">{employee.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-bold text-foreground uppercase tracking-wide">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedEmployee.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 text-lg font-semibold">{employee.phone}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="userType" className="text-sm font-bold text-foreground uppercase tracking-wide">Role</Label>
                  {isEditing ? (
                    <Select
                      value={editedEmployee.userType || ""}
                      onValueChange={(value) => handleInputChange("userType", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="store_executive">Store Executive</SelectItem>
                        <SelectItem value="sales_rep">Sales Rep</SelectItem>
                        {/* Add other possible userTypes as needed */}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-2 text-lg font-medium">{employee.userType.replace('_', ' ').toUpperCase()}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="outletId" className="text-sm font-bold text-foreground uppercase tracking-wide">Outlet</Label>
                  {isEditing ? (
                    <Select
                      value={editedEmployee.outletId || ""}
                      onValueChange={(value) => handleInputChange("outletId", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select outlet" />
                      </SelectTrigger>
                      <SelectContent>
                        {outlets.map(outlet => (
                          <SelectItem key={outlet.id} value={outlet.id}>{outlet.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-2 text-lg font-medium">{employee.outlet?.name || 'N/A'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Current Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedEmployee.status || ""}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-2">
                      <Badge
                        variant={
                          employee.status === "active" ? "default" :
                          "destructive"
                        }
                      >
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>
                {employee.business && (
                  <div>
                    <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Business</Label>
                    <p className="mt-2 text-lg font-medium">{employee.business.name}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Last Login</Label>
                  <p className="mt-2 text-lg font-medium">
                    {employee.lastLogin ? new Date(employee.lastLogin).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Created</Label>
                  <p className="mt-2 text-lg font-medium">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Last Updated</Label>
                  <p className="mt-2 text-lg font-medium">
                    {new Date(employee.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}