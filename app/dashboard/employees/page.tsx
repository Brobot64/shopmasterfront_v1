// app/employees/page.tsx (updated with proper types)
"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Filter, Users, Eye, Edit, Trash2, UserCheck, UserX, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usersService } from "@/services"
import { UserWithDetails } from "@/services/users"
import { UsersResponse } from "@/services/users"
import { toast } from "@/lib/toast"
import { usePermissions } from "@/lib/auth-middleware"
import { AddEmployeeForm } from "@/components/add-employee-form"

export default function EmployeesPage() {
  const [users, setUsers] = useState<UserWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  const { canManageUsers, user: currentUser } = usePermissions()

  const fetchUsers = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      const params: any = {
        page,
        limit: itemsPerPage,
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }
      if (currentUser?.businessId) {
        params.businessId = currentUser.businessId
      }
      
      const response: UsersResponse = await usersService.getUsers(params)
      setUsers(response.data)
      setTotalItems(response.totalItems || 0)
      setTotalPages(response.totalPages || 1)
      setCurrentPage(response.currentPage || 1)
    } catch (error) {
      toast.error('Failed to fetch users')
      console.error('Error fetching users:', error)
      setUsers([])
      setTotalItems(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [currentUser?.businessId, searchQuery, currentPage])

  useEffect(() => {
    fetchUsers(1)
  }, [fetchUsers])

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
    fetchUsers(currentPage)
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm(`Are you sure you want to delete this user?`)) {
      try {
        await usersService.deleteUser(userId)
        toast.success('User deleted successfully')
        setIsDeleteDialogOpen(false)
        setSelectedUser(null)
        fetchUsers(currentPage)
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete user')
      }
    }
  }

  const handleStatusToggle = async (userId: string, newStatus: 'active' | 'suspended') => {
    try {
      await usersService.updateUser(userId, { status: newStatus })
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`)
      fetchUsers(currentPage)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user status')
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "suspended":
        return <Badge variant="secondary">Suspended</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!canManageUsers()) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You don't have permission to manage users.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Team Management
          </h1>
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground mt-2">
            <span>Dashboard</span>
            <span>•</span>
            <span className="text-foreground">Employees</span>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9 w-64"
            />
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Create a new employee record. Fill in all the required information below.
                </DialogDescription>
              </DialogHeader>
              <AddEmployeeForm 
                onSuccess={() => {
                  setIsAddDialogOpen(false)
                  fetchUsers(1)
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(user => user.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended Users</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(user => user.status === 'suspended').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Phone</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Role</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Outlet</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="h-24 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="h-24 text-center text-muted-foreground">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-t transition-colors hover:bg-muted/50">
                      <td className="p-4 font-medium">{user.firstName} {user.lastName}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.phone}</td>
                      <td className="p-4">
                        <span className="capitalize">{user.userType.replace('_', ' ')}</span>
                      </td>
                      <td className="p-4">{user.outlet?.name || 'N/A'}</td>
                      <td className="p-4">{getStatusBadge(user.status)}</td>
                      <td className="p-4">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={isDeleteDialogOpen && selectedUser?.id === user.id} onOpenChange={() => {
                            if (selectedUser?.id === user.id) {
                              setIsDeleteDialogOpen(false)
                              setSelectedUser(null)
                            }
                          }}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive/80"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the user
                                  {selectedUser && ` "${selectedUser.firstName} ${selectedUser.lastName}"`} and remove their data from the system.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
              {totalItems} employees
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm">{selectedUser.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <p className="text-sm capitalize">{selectedUser.userType.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                  <p className="text-sm">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                {selectedUser.updatedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-sm">{new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              {selectedUser.business && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Business</label>
                  <p className="text-sm font-medium">{selectedUser.business.name}</p>
                </div>
              )}
              {selectedUser.outlet && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Outlet</label>
                  <p className="text-sm font-medium">{selectedUser.outlet.name}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <AddEmployeeForm 
              user={selectedUser}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                setSelectedUser(null)
                fetchUsers(currentPage)
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}