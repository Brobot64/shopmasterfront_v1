"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Filter, MapPin, Users, Package, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
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
import { outletsService, Outlet, OutletsResponse } from "@/services"
import { toast } from "@/lib/toast"
import { useAuth } from "@/contexts/auth-context"
import { AddOutletForm } from "@/components/add-outlet-form"

export default function OutletsPage() {
  const { user } = useAuth()
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  const fetchOutlets = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      const params: any = {
        page,
        limit: itemsPerPage,
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }
      if (user?.businessId) {
        params.businessId = user.businessId
      }
      
      const response: OutletsResponse = await outletsService.getOutlets(user.businessId, params)
      setOutlets(response.data)
      setTotalItems(response.totalItems || 0)
      setTotalPages(response.totalPages || 1)
      setCurrentPage(response.currentPage || 1)
    } catch (error) {
      toast.error('Failed to fetch outlets')
      console.error('Error fetching outlets:', error)
      setOutlets([])
      setTotalItems(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [user?.businessId, searchQuery])

  useEffect(() => {
    fetchOutlets(1)
  }, [fetchOutlets])

  const handleDeleteOutlet = async (outletId: string) => {
    if (confirm(`Are you sure you want to delete "${selectedOutlet?.name}"?`)) {
      try {
        await outletsService.deleteOutlet(outletId)
        toast.success('Outlet deleted successfully')
        setIsDeleteDialogOpen(false)
        setSelectedOutlet(null)
        fetchOutlets(currentPage)
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete outlet')
      }
    }
  }

  const handleStatusToggle = async (outletId: string, newStatus: 'active' | 'inactive') => {
    try {
      if (newStatus === 'active') {
        await outletsService.activateOutlet(outletId)
      } else {
        await outletsService.deactivateOutlet(outletId)
      }
      toast.success(`Outlet ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
      fetchOutlets(currentPage)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update outlet status')
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MapPin className="h-8 w-8" />
            Outlets Management
          </h1>
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground mt-2">
            <span>Dashboard</span>
            <span>•</span>
            <span className="text-foreground">Outlets</span>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search outlets..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9 w-64"
            />
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Outlet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Outlet</DialogTitle>
              </DialogHeader>
              <AddOutletForm 
                onSuccess={() => {
                  setIsAddDialogOpen(false)
                  fetchOutlets(1)
                  toast.success('Outlet added successfully')
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
            <CardTitle className="text-sm font-medium">Total Outlets</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Outlets</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {outlets.filter(outlet => outlet.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Outlets</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {outlets.filter(outlet => outlet.status === 'inactive').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outlets Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Address</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Phone</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-sm">Created</th>
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
                ) : outlets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="h-24 text-center text-muted-foreground">
                      No outlets found
                    </td>
                  </tr>
                ) : (
                  outlets.map((outlet) => (
                    <tr key={outlet.id} className="border-t transition-colors hover:bg-muted/50">
                      <td className="p-4 font-medium">{outlet.name}</td>
                      <td className="p-4">
                        <div className="max-w-xs truncate">{outlet.address}</div>
                      </td>
                      <td className="p-4">{outlet.phone || 'N/A'}</td>
                      <td className="p-4">
                        <div className="max-w-xs truncate">{outlet.email || 'N/A'}</div>
                      </td>
                      <td className="p-4">{getStatusBadge(outlet.status)}</td>
                      <td className="p-4">
                        {new Date(outlet.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedOutlet(outlet)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedOutlet(outlet)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog 
                            open={isDeleteDialogOpen && selectedOutlet?.id === outlet.id} 
                            onOpenChange={() => {
                              if (selectedOutlet?.id === outlet.id) {
                                setIsDeleteDialogOpen(false)
                                setSelectedOutlet(null)
                              }
                            }}
                          >
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
                                  This action cannot be undone. This will permanently delete the outlet
                                  {selectedOutlet && ` "${selectedOutlet.name}"`} and remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteOutlet(outlet.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Outlet
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
              {totalItems} outlets
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

      {/* View Outlet Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Outlet Details</DialogTitle>
          </DialogHeader>
          {selectedOutlet && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm font-medium">{selectedOutlet.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedOutlet.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm">{selectedOutlet.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{selectedOutlet.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{new Date(selectedOutlet.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{new Date(selectedOutlet.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm">{selectedOutlet.address}</p>
              </div>
              {selectedOutlet.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm text-muted-foreground">{selectedOutlet.description}</p>
                </div>
              )}
              {selectedOutlet.contact && selectedOutlet.contact.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contacts</label>
                  <div className="mt-2 space-y-1">
                    {selectedOutlet.contact.map((contact, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="font-medium">{contact.name}:</span>
                        <span>{contact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedOutlet.business && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business</label>
                  <p className="text-sm font-medium">{selectedOutlet.business.name}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Outlet Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Outlet</DialogTitle>
          </DialogHeader>
          {selectedOutlet && (
            <AddOutletForm 
              outlet={selectedOutlet}
              onSuccess={() => {
                setIsEditDialogOpen(false)
                setSelectedOutlet(null)
                fetchOutlets(currentPage)
                toast.success('Outlet updated successfully')
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}