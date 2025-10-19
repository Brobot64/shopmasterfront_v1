"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sales, CreateSalesData, SalesProduct, SalesStatus, PaymentChannel } from "@/services"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { productsService, Product } from "@/services"
import { ownerDashboardService, Outlet } from "@/services"

const PENDING_SALES_KEY = 'pending_sales'
const MAX_PENDING_SALES = 10

interface AddSaleFormProps {
  sale?: Sales
  onSuccess?: (newSale: Sales) => void
  onUpdate?: (updatedSale: Sales) => void
  onComplete?: () => void
}

export function AddSaleForm({ sale, onSuccess, onUpdate, onComplete }: AddSaleFormProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [selectedOutletId, setSelectedOutletId] = useState<string>(sale?.outletId || user?.outletId || "")
  const [saleProducts, setSaleProducts] = useState<SalesProduct[]>(sale?.products || [])
  const [formData, setFormData] = useState({
    customerName: sale?.customerName || "",
    customerPhone: sale?.customerPhone || "",
    discount: sale?.discount || 0,
    amountPaid: sale?.amountPaid || 0,
    paymentChannel: sale?.paymentChannel || PaymentChannel.CASH,
    notes: sale?.notes || "",
  })

  useEffect(() => {
    if (sale) {
      // If editing existing sale, load products for the outlet
      if (sale.outletId) {
        fetchProducts(sale.outletId)
      }
    } else {
      // If creating new sale, load outlets first
      fetchOutlets()
    }
  }, [sale, user?.businessId])

  const fetchOutlets = async () => {
    try {
      if (user?.businessId) {
        const response = await ownerDashboardService.getAllOutletsByBiz(user.businessId)
        setOutlets(response.data)
        // Auto-select user's outlet if available
        if (user.outletId && response.data.some((outlet: Outlet) => outlet.id === user.outletId)) {
          setSelectedOutletId(user.outletId)
        } else if (response.data.length > 0) {
          setSelectedOutletId(response.data[0].id)
        }
      }
    } catch (error) {
      toast.error('Failed to load outlets')
      console.error(error)
    }
  }

  const fetchProducts = async (outletId: string) => {
    try {
      const params = outletId ? { outletId } : {}
      const response = await productsService.getProducts(params) // Use getProducts if getProductsByOutlet not available
      setProducts(response.data)
    } catch (error) {
      toast.error('Failed to load products')
      console.error(error)
    }
  }

  useEffect(() => {
    if (selectedOutletId && !sale) {
      fetchProducts(selectedOutletId)
    }
  }, [selectedOutletId, sale])

  const addProduct = () => {
    setSaleProducts([...saleProducts, { productId: '', productName: '', quantity: 1, priceAtSale: 0 }])
  }

  const removeProduct = (index: number) => {
    setSaleProducts(saleProducts.filter((_, i) => i !== index))
  }

  const updateProduct = (index: number, field: keyof SalesProduct, value: any) => {
    const newProducts = [...saleProducts]
    newProducts[index] = { ...newProducts[index], [field]: value }
    if (field === 'productId') {
      const selectedProduct = products.find(p => p.id === value)
      if (selectedProduct) {
        newProducts[index].productName = selectedProduct.name
        newProducts[index].priceAtSale = selectedProduct.price
      }
    }
    setSaleProducts(newProducts)
  }

  const calculateTotal = () => {
    const subtotal = saleProducts.reduce((sum, p) => sum + (p.quantity * parseFloat(p.priceAtSale as any)), 0)
    const afterDiscount = subtotal - parseFloat(formData.discount as any)
    return afterDiscount
  }

  const handleCreateNewSale = () => {
    if (!selectedOutletId) {
      toast.error('Please select an outlet first')
      return
    }
    if (saleProducts.length === 0) {
      toast.error('Please add at least one product')
      return
    }

    setIsCreating(true)
    try {
      const newSale: Sales = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        totalAmount: calculateTotal(),
        discount: parseFloat(formData.discount as any),
        status: SalesStatus.PENDING,
        remainingToPay: calculateTotal() - parseFloat(formData.amountPaid as any),
        amountPaid: parseFloat(formData.amountPaid as any),
        paymentChannel: formData.paymentChannel,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        salesPersonId: user?.id || '',
        outletId: selectedOutletId,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        products: saleProducts,
      }

      if (onSuccess) {
        onSuccess(newSale)
      }

      toast.success('New sale created locally')
    } catch (error) {
      toast.error('Failed to create sale')
      console.error(error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateSale = () => {
    if (saleProducts.length === 0) {
      toast.error('Please add at least one product')
      return
    }

    setIsLoading(true)
    try {
      const updatedSaleData: Partial<Sales> = {
        totalAmount: calculateTotal(),
        discount: parseFloat(formData.discount as any),
        amountPaid: parseFloat(formData.amountPaid as any),
        remainingToPay: calculateTotal() - parseFloat(formData.amountPaid as any),
        paymentChannel: formData.paymentChannel,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        notes: formData.notes,
      }

      if (sale) {
        const updatedSale = { ...sale, ...updatedSaleData, products: saleProducts }
        if (onUpdate) {
          onUpdate(updatedSale)
        }
      }

      toast.success('Sale updated locally')
    } catch (error) {
      toast.error('Failed to update sale')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteSale = () => {
    if (onComplete) {
      onComplete()
    }
    toast.success('Sale marked as complete')
  }

  const isEditingMode = !!sale
  const isNewSale = !sale

  return (
    <div className="space-y-6">
      {!isEditingMode && (
        <Card>
          <CardHeader>
            <CardTitle>Select Outlet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedOutletId} onValueChange={setSelectedOutletId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an outlet to start a sale" />
                </SelectTrigger>
                <SelectContent>
                  {outlets.map((outlet) => (
                    <SelectItem key={outlet.id} value={outlet.id}>
                      {outlet.name} - {outlet.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isEditingMode ? 'Edit Sale' : 'New Sale'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Products Section */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Products</Label>
              {saleProducts.map((sp, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <Select 
                    value={sp.productId} 
                    onValueChange={(v) => updateProduct(index, 'productId', v)}
                    disabled={!selectedOutletId}
                  >
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} - ${p.price} (Stock: {p.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input 
                    type="number" 
                    placeholder="Qty" 
                    value={sp.quantity} 
                    onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-20"
                    disabled={!sp.productId}
                  />
                  <div className="text-sm font-medium">
                    ${parseFloat(sp.priceAtSale as any).toFixed(2)}
                  </div>
                  <div className="text-sm font-medium">
                    Total: ${(sp.quantity * parseFloat(sp.priceAtSale as any)).toFixed(2)}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeProduct(index)}
                    className="h-10"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button 
                onClick={addProduct} 
                variant="outline"
                disabled={!selectedOutletId}
              >
                Add Product
              </Button>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input 
                  value={formData.customerName} 
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  placeholder="Enter customer name (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label>Customer Phone</Label>
                <Input 
                  value={formData.customerPhone} 
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  placeholder="Enter customer phone (optional)"
                />
              </div>
            </div>

            {/* Financials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Discount ($)</Label>
                <Input 
                  type="number" 
                  value={formData.discount} 
                  onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Amount Paid ($)</Label>
                <Input 
                  type="number" 
                  value={formData.amountPaid} 
                  onChange={(e) => setFormData({...formData, amountPaid: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select 
                  value={formData.paymentChannel} 
                  onValueChange={(v) => setFormData({...formData, paymentChannel: v as PaymentChannel})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentChannel).map(channel => (
                      <SelectItem key={channel} value={channel}>
                        {channel.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea 
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes about this sale..."
                rows={3}
              />
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                Subtotal: ${calculateTotal().toFixed(2)}
              </div>
              <div className="text-xl font-semibold text-blue-600">
                Amount Paid: ${parseFloat(formData.amountPaid as any).toFixed(2)}
              </div>
              <div className={`text-xl font-bold ${calculateTotal() - parseFloat(formData.amountPaid as any) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                Remaining: ${(calculateTotal() - parseFloat(formData.amountPaid as any)).toFixed(2)}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {isEditingMode ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleUpdateSale} 
                    disabled={isLoading}
                  >
                    Update Sale
                  </Button>
                  <Button 
                    onClick={handleCompleteSale} 
                    disabled={isLoading}
                  >
                    Complete Sale
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleCreateNewSale} 
                  disabled={isCreating || saleProducts.length === 0 || !selectedOutletId}
                  className="w-full"
                >
                  {isCreating ? "Creating Sale..." : "Create Sale"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}