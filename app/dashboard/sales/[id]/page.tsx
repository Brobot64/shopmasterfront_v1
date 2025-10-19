"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Save, X, Eye, Trash2, Printer } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { salesService, Sales, UpdateSalesData, SalesStatus, PaymentChannel } from "@/services"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

export default function SaleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [sale, setSale] = useState<Sales | null>(null)
  const [editedSale, setEditedSale] = useState<Partial<Sales>>({})

  const saleId = params.id as string

  useEffect(() => {
    fetchSale()
  }, [saleId])

  const fetchSale = async () => {
    try {
      setIsLoading(true)
      const response = await salesService.getSaleById(saleId)
      const fetchedSale = response.data.sale
      setSale(fetchedSale)
      setEditedSale({
        totalAmount: fetchedSale.totalAmount,
        discount: fetchedSale.discount,
        amountPaid: fetchedSale.amountPaid,
        paymentChannel: fetchedSale.paymentChannel,
        customerName: fetchedSale.customerName,
        customerPhone: fetchedSale.customerPhone,
        notes: fetchedSale.notes,
        status: fetchedSale.status,
      })
    } catch (error) {
      console.error("Error fetching sale:", error)
      toast.error("Failed to load sale details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const updateData: UpdateSalesData = {
        discount: parseFloat(editedSale.discount as any) || 0,
        amountPaid: parseFloat(editedSale.amountPaid as any) || 0,
        paymentChannel: editedSale.paymentChannel as PaymentChannel,
        customerName: editedSale.customerName,
        customerPhone: editedSale.customerPhone,
        notes: editedSale.notes,
        status: editedSale.status as SalesStatus,
      }

      const response = await salesService.updateSale(saleId, updateData)
      setSale(response.data.sale)
      setIsEditing(false)
      toast.success("Sale updated successfully")
    } catch (error) {
      console.error("Error updating sale:", error)
      toast.error("Failed to update sale")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedSale({
      totalAmount: sale?.totalAmount,
      discount: sale?.discount,
      amountPaid: sale?.amountPaid,
      paymentChannel: sale?.paymentChannel,
      customerName: sale?.customerName,
      customerPhone: sale?.customerPhone,
      notes: sale?.notes,
      status: sale?.status,
    })
    setIsEditing(false)
  }

  const calculateRemaining = () => {
    if (!sale || !editedSale.amountPaid || !editedSale.discount) return 0
    const total = parseFloat(sale.totalAmount as any)
    const disc = parseFloat(editedSale.discount as any) || 0
    const paid = parseFloat(editedSale.amountPaid as any) || 0
    return (total - disc) - paid
  }

  const handlePrintReceipt = () => {
    setShowReceiptModal(true)
  }

  const printReceipt = () => {
    const printContent = document.getElementById('receipt-print') as HTMLElement
    if (printContent) {
      const originalContent = document.body.innerHTML
      document.body.innerHTML = printContent.innerHTML
      window.print()
      document.body.innerHTML = originalContent
      // Restore focus to the modal
      setTimeout(() => setShowReceiptModal(true), 100)
    }
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
        </div>
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-extrabold tracking-tight">Sale Not Found</h1>
        </div>
        <p className="text-muted-foreground">The sale you're looking for doesn't exist.</p>
      </div>
    )
  }

  const totalAmount = parseFloat(sale.totalAmount as any)
  const discountAmount = parseFloat(sale.discount as any)
  const subTotal = totalAmount - discountAmount
  const remaining = calculateRemaining()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Sale #{sale.reference || sale.id.slice(0, 8)}
              </h1>
              <nav className="flex items-center space-x-1 text-sm text-muted-foreground mt-2">
                <span>Dashboard</span>
                <span>•</span>
                <span>Sales</span>
                <span>•</span>
                <span className="text-foreground font-semibold">#{sale.reference || sale.id.slice(0, 8)}</span>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handlePrintReceipt}
            disabled={sale.status !== 'completed'}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
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
              Edit Sale
            </Button>
          )}
        </div>
      </div>

      {/* Sale Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Sale Overview
            <Badge variant={sale.status === 'completed' ? "default" : "secondary"}>
              {sale.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Total Amount</Label>
            <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Discount</Label>
            <p className="text-2xl font-bold">-${discountAmount.toFixed(2)}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Subtotal</Label>
            <p className="text-2xl font-bold">${subTotal.toFixed(2)}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Amount Paid</Label>
            {isEditing ? (
              <Input
                type="number"
                value={editedSale.amountPaid || ''}
                onChange={(e) => setEditedSale({ ...editedSale, amountPaid: parseFloat(e.target.value) || 0 })}
                className="mt-1"
                min={0}
                max={subTotal}
              />
            ) : (
              <p className="text-2xl font-bold">${parseFloat(sale.amountPaid as any).toFixed(2)}</p>
            )}
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <Label className="text-sm font-medium text-muted-foreground">Remaining Balance</Label>
            <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${remaining.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sale Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(sale.products || []).map((product, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${parseFloat(product.priceAtSale as any).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      Total: ${(product.quantity * parseFloat(product.priceAtSale as any)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {sale.products && sale.products.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No products in this sale</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Payment & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Payment Method</Label>
              {isEditing ? (
                <Select
                  value={editedSale.paymentChannel || ''}
                  onValueChange={(value) => setEditedSale({ ...editedSale, paymentChannel: value as PaymentChannel })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentChannel).map((channel) => (
                      <SelectItem key={channel} value={channel}>
                        {channel.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-lg font-medium mt-1">
                  {sale.paymentChannel?.replace('_', ' ').toUpperCase()}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Status</Label>
              {isEditing ? (
                <Select
                  value={editedSale.status || ''}
                  onValueChange={(value) => setEditedSale({ ...editedSale, status: value as SalesStatus })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SalesStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={SalesStatus.COMPLETED}>Completed</SelectItem>
                    <SelectItem value={SalesStatus.CANCELLED}>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge
                  variant={sale.status === SalesStatus.COMPLETED ? "default" : sale.status === SalesStatus.CANCELLED ? "destructive" : "secondary"}
                  className="mt-1"
                >
                  {sale.status}
                </Badge>
              )}
            </div>

            <div>
              <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Discount</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedSale.discount || ''}
                  onChange={(e) => setEditedSale({ ...editedSale, discount: parseFloat(e.target.value) || 0 })}
                  className="mt-1"
                  min={0}
                />
              ) : (
                <p className="text-lg font-medium mt-1">-${parseFloat(sale.discount as any).toFixed(2)}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Customer Name</Label>
              {isEditing ? (
                <Input
                  value={editedSale.customerName || ''}
                  onChange={(e) => setEditedSale({ ...editedSale, customerName: e.target.value })}
                  className="mt-1"
                  placeholder="Enter customer name"
                />
              ) : (
                <p className="text-lg font-medium mt-1">{sale.customerName || 'Anonymous'}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Customer Phone</Label>
              {isEditing ? (
                <Input
                  value={editedSale.customerPhone || ''}
                  onChange={(e) => setEditedSale({ ...editedSale, customerPhone: e.target.value })}
                  className="mt-1"
                  placeholder="Enter customer phone"
                />
              ) : (
                <p className="text-lg font-medium mt-1">{sale.customerPhone || 'N/A'}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Notes</Label>
              {isEditing ? (
                <Textarea
                  value={editedSale.notes || ''}
                  onChange={(e) => setEditedSale({ ...editedSale, notes: e.target.value })}
                  className="mt-1 min-h-[80px]"
                  placeholder="Additional notes about this sale"
                />
              ) : (
                <p className="text-lg mt-1">{sale.notes || 'No notes'}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Created</Label>
                <p className="text-lg font-medium mt-1">{new Date(sale.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm font-bold text-foreground uppercase tracking-wide">Last Updated</Label>
                <p className="text-lg font-medium mt-1">{new Date(sale.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receipt Modal */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="p-6">
            <DialogTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Receipt for Sale #{sale.reference || sale.id.slice(0, 8)}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div id="receipt-print" className="print:hidden">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Receipt</h1>
                  <p className="text-sm text-gray-600">Sale #{sale.reference || sale.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(sale.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="space-y-4 mb-6">
                  {sale.customerName && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Customer:</p>
                      <p className="text-sm text-gray-600">{sale.customerName}</p>
                      {sale.customerPhone && <p className="text-sm text-gray-600">{sale.customerPhone}</p>}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700">Items:</p>
                    {(sale.products || []).map((product, index) => (
                      <div key={index} className="flex justify-between text-sm border-b py-1">
                        <span>{product.productName} x {product.quantity}</span>
                        <span>${(product.quantity * parseFloat(product.priceAtSale as any)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${subTotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Discount:</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold mt-2">
                      <span>Total:</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Amount Paid:</span>
                      <span>${parseFloat(sale.amountPaid as any).toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between text-sm ${remaining > 0 ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                      <span>Remaining:</span>
                      <span>${remaining.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500 mt-6">
                  <p>Thank you for your business!</p>
                  <p>Sales Person: {sale.salesPerson?.firstName} {sale.salesPerson?.lastName}</p>
                  <p>Outlet: {sale.outlet?.name}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-6">
            <Button variant="outline" onClick={() => setShowReceiptModal(false)}>
              Close
            </Button>
            <Button onClick={printReceipt}>
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}