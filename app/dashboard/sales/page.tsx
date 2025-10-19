"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { salesService, Sales, SalesListResponse, SalesStatus, CreateSalesData } from "@/services"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { AddSaleForm } from "@/components/add-sale-form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const PENDING_SALES_KEY = 'pending_sales'

export default function SalesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [pendingSales, setPendingSales] = useState<Sales[]>([])
  const [completedSales, setCompletedSales] = useState<Sales[]>([])
  const [activeTab, setActiveTab] = useState<string>('')
  const [isLoadingPending, setIsLoadingPending] = useState(true)
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCompleted, setTotalCompleted] = useState(0)
  const itemsPerPage = 10
  const MAX_PENDING_SALES = 10

  // Load pending sales from sessionStorage
  const 
  loadPendingSales = () => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(PENDING_SALES_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Sales[]
          setPendingSales(parsed.slice(0, MAX_PENDING_SALES)) // Limit to 10
          if (parsed.length > 0) {
            setActiveTab(parsed[0].id)
          } else {
            setActiveTab('new-sale')
          }
        } catch (error) {
          console.error('Error parsing pending sales:', error)
          sessionStorage.removeItem(PENDING_SALES_KEY)
        }
      } else {
        setActiveTab('new-sale')
      }
    }
    setIsLoadingPending(!isLoadingPending);
  }

  // Save pending sales to sessionStorage
  const savePendingSales = (sales: Sales[]) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PENDING_SALES_KEY, JSON.stringify(sales))
    }
  }

  const fetchCompletedSales = useCallback(async (page: number = 1) => {
    try {
      setIsLoadingCompleted(true)
      const params = { 
        status: SalesStatus.COMPLETED,
        page,
        limit: itemsPerPage
      }
      
      // if (user?.outletId) {
      //   params.outletId = user.outletId
      // }

      const response: SalesListResponse = await salesService.getSales(params)
      setCompletedSales(response.data)
      setTotalCompleted(response.totalItems || 0)
      setTotalPages(response.totalPages || 1)
      setCurrentPage(response.currentPage || 1)
    } catch (error) {
      toast.error('Failed to fetch completed sales')
      console.error(error)
    } finally {
      setIsLoadingCompleted(false)
    }
  }, [user?.outletId])

  useEffect(() => {
    loadPendingSales()
    fetchCompletedSales()
  }, [fetchCompletedSales])

  const handleCreateNewSale = async (saleData: Omit<Sales, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'salesPerson' | 'outlet'>) => {
    if (pendingSales.length >= MAX_PENDING_SALES) {
      toast.error(`Maximum of ${MAX_PENDING_SALES} ongoing sales allowed`)
      return
    }

    try {
      if (!user?.outletId) {
        toast.error('Outlet ID is required to create sale')
        return
      }

      // Create minimal pending sale object for frontend
      const newSale: Sales = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Temporary ID
        ...saleData,
        status: SalesStatus.PENDING,
        remainingToPay: parseFloat(saleData.totalAmount as any) - parseFloat(saleData.amountPaid as any),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        products: saleData.products || [],
      }

      const updatedPending = [newSale, ...pendingSales]
      setPendingSales(updatedPending)
      savePendingSales(updatedPending)
      setActiveTab(newSale.id)
      toast.success('New ongoing sale created')
    } catch (error) {
      toast.error('Failed to create new sale')
      console.error(error)
    }
  }

  const handleSaleUpdated = (updatedSale: Sales) => {
    if (updatedSale.status !== SalesStatus.PENDING) {
      // Remove from pending if completed or cancelled
      const filteredPending = pendingSales.filter(s => s.id !== updatedSale.id)
      setPendingSales(filteredPending)
      savePendingSales(filteredPending)
      fetchCompletedSales(currentPage) // Refresh completed
      if (filteredPending.length > 0) {
        setActiveTab(filteredPending[0].id)
      } else {
        setActiveTab('new-sale')
      }
    } else {
      // Update in pending list
      const updatedPending = pendingSales.map(s => s.id === updatedSale.id ? updatedSale : s)
      setPendingSales(updatedPending)
      savePendingSales(updatedPending)
    }
  }

  const handleCompletePendingSale = async (sale: Sales) => {
    try {
      // Convert to backend format
      const backendData: CreateSalesData = {
        products: (sale.products || []).map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          priceAtSale: parseFloat(p.priceAtSale as any)
        })),
        discount: parseFloat(sale.discount as any),
        amountPaid: parseFloat(sale.amountPaid as any),
        paymentChannel: sale.paymentChannel,
        customerName: sale.customerName,
        customerPhone: sale.customerPhone,
        outletId: sale.outletId,
        notes: sale.notes,
      }

      const response = await salesService.createSale(backendData)
      const completedSale = response.data.sale

      // Remove from pending
      const filteredPending = pendingSales.filter(s => s.id !== sale.id)
      setPendingSales(filteredPending)
      savePendingSales(filteredPending)

      // Refresh completed
      fetchCompletedSales(currentPage)
      toast.success('Sale completed successfully')
      if (filteredPending.length > 0) {
        setActiveTab(filteredPending[0].id)
      } else {
        setActiveTab('new-sale')
      }
    } catch (error) {
      toast.error('Failed to complete sale')
      console.error(error)
    }
  }

  const getStatusBadge = (status: SalesStatus) => {
    switch (status) {
      case SalesStatus.COMPLETED:
        return <Badge variant="default">Completed</Badge>
      case SalesStatus.PENDING:
        return <Badge variant="secondary">Pending</Badge>
      case SalesStatus.CANCELLED:
        return <Badge variant="destructive">Cancelled</Badge>
      case SalesStatus.REFUNDED:
        return <Badge variant="outline">Refunded</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground mt-2">
            <span>Dashboard</span>
            <span>•</span>
            <span className="text-foreground">Sales</span>
          </nav>
        </div>
      </div>

      {/* Ongoing Sales Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Ongoing Sales (Pending) 
            <span className="text-sm text-muted-foreground ml-2">
              ({pendingSales.length}/{MAX_PENDING_SALES})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPending ? (
            <p className="text-center py-4">Loading pending sales...</p>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid w-full grid-cols-2">
                {pendingSales.map((sale, index) => (
                  <TabsTrigger key={sale.id} value={sale.id} className="truncate">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium">
                        {sale.reference || sale.id.slice(0, 8)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Customer: {sale.customerName || 'Anonymous'}
                      </span>
                    </div>
                  </TabsTrigger>
                ))}
                {pendingSales.length < MAX_PENDING_SALES && (
                  <TabsTrigger value="new-sale" className="text-muted-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    New Sale
                  </TabsTrigger>
                )}
              </TabsList>
              
              {pendingSales.map((sale) => (
                <TabsContent key={sale.id} value={sale.id}>
                  <AddSaleForm 
                    sale={sale}
                    onSuccess={(updatedSale) => handleSaleUpdated(updatedSale)}
                    onComplete={() => handleCompletePendingSale(sale)}
                  />
                </TabsContent>
              ))}
              
              {pendingSales.length < MAX_PENDING_SALES && (
                <TabsContent value="new-sale" className="pt-4">
                  <AddSaleForm 
                    onSuccess={handleCompletePendingSale}
                  />
                </TabsContent>
              )}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Completed Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Completed Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingCompleted ? (
            <p className="text-center py-4">Loading completed sales...</p>
          ) : completedSales.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No completed sales yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Outlet</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">
                          {sale.reference || sale.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>{sale.customerName || 'Anonymous'}</TableCell>
                        <TableCell>{sale.outlet?.name || 'N/A'}</TableCell>
                        <TableCell className="font-medium">
                          ${parseFloat(sale.totalAmount as any).toFixed(2)}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          ${parseFloat(sale.amountPaid as any).toFixed(2)}
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          ${parseFloat(sale.remainingToPay as any).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {sale.paymentChannel?.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(sale.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => router.push(`/dashboard/sales/${sale.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between mt-6 p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, totalCompleted)} of {totalCompleted} sales
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="px-3 py-1 text-sm bg-muted rounded-md">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}