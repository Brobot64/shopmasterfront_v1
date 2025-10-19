"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock employee data
const mockEmployee = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@company.com",
  phone: "+1 (555) 123-4567",
  position: "Software Engineer",
  department: "Engineering",
  salary: 75000,
  status: "active" as const,
  hireDate: "2023-01-15",
  address: "123 Main St, City, State 12345",
  emergencyContact: "Jane Doe - +1 (555) 987-6543",
  notes: "Excellent performance, team player, strong technical skills.",
  createdAt: "January 15, 2023",
  updatedAt: "December 30, 2024",
}

export default function EmployeePage() {
  const params = useParams()
  const id = params.id as string
  const [isEditing, setIsEditing] = useState(false)
  const [employee] = useState(mockEmployee)
  const [editedEmployee, setEditedEmployee] = useState(mockEmployee)

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving employee:", editedEmployee)
    setIsEditing(false)
    alert("Employee updated successfully!")
  }

  const handleCancel = () => {
    setEditedEmployee(employee)
    setIsEditing(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold tracking-tight truncate">
                {employee.firstName} {employee.lastName}
              </h1>
              <nav className="flex items-center space-x-1 text-sm text-muted-foreground mt-2 truncate">
                <span className="truncate">Dashboard</span>
                <span className="flex-shrink-0">•</span>
                <span className="truncate">Employees</span>
                <span className="flex-shrink-0">•</span>
                <span className="text-foreground truncate">{employee.firstName} {employee.lastName}</span>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Employee
            </Button>
          )}
        </div>
      </div>

      {/* Employee Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">First Name</Label>
                {isEditing ? (
                  <Input
                    value={editedEmployee.firstName}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, firstName: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-lg font-medium mt-2">{employee.firstName}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Last Name</Label>
                {isEditing ? (
                  <Input
                    value={editedEmployee.lastName}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, lastName: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-lg font-medium mt-2">{employee.lastName}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedEmployee.email}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-lg font-medium mt-2">{employee.email}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Phone</Label>
                {isEditing ? (
                  <Input
                    value={editedEmployee.phone}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, phone: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-lg font-medium mt-2">{employee.phone}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Address</Label>
                {isEditing ? (
                  <Textarea
                    value={editedEmployee.address}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, address: e.target.value })}
                    className="mt-2 min-h-[80px]"
                  />
                ) : (
                  <p className="text-lg mt-2">{employee.address}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Position</Label>
                {isEditing ? (
                  <Input
                    value={editedEmployee.position}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, position: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-lg font-medium mt-2">{employee.position}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Department</Label>
                {isEditing ? (
                  <Select
                    value={editedEmployee.department}
                    onValueChange={(value) => setEditedEmployee({ ...editedEmployee, department: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-lg font-medium mt-2">{employee.department}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Salary</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedEmployee.salary}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, salary: parseInt(e.target.value) })}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-lg font-medium mt-2">${employee.salary.toLocaleString()}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Status</Label>
                {isEditing ? (
                  <Select
                    value={editedEmployee.status}
                    onValueChange={(value: string) => setEditedEmployee({ ...editedEmployee, status: value as typeof mockEmployee.status })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-2">
                    <Badge variant={employee.status === "active" ? "default" : employee.status === "inactive" ? "secondary" : "destructive"}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Emergency Contact</Label>
                {isEditing ? (
                  <Input
                    value={editedEmployee.emergencyContact}
                    onChange={(e) => setEditedEmployee({ ...editedEmployee, emergencyContact: e.target.value })}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-lg font-medium mt-2">{employee.emergencyContact}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Notes</Label>
            {isEditing ? (
              <Textarea
                value={editedEmployee.notes}
                onChange={(e) => setEditedEmployee({ ...editedEmployee, notes: e.target.value })}
                className="mt-2 min-h-[100px]"
              />
            ) : (
              <p className="text-lg mt-2">{employee.notes}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Hire Date</Label>
              <p className="text-lg font-medium mt-2">{employee.hireDate}</p>
            </div>
            <div>
              <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Last Updated</Label>
              <p className="text-lg font-medium mt-2">{employee.updatedAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}